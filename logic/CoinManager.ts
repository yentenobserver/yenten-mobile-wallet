import * as Random from 'expo-random';
import * as yenten from 'yentenjs-lib';
import { apiClient, SendTransactionResponse, UnspentTransaction, UnspentTransactionResponse, Response} from 'yenten-api-blockchain';
const CryptoES = require('crypto-es').default;
import {UserSetting, WalletData} from '../data/localStorage/Model'

import {AppManager} from './AppManager'

var Buffer = require('safe-buffer').Buffer

import Constants from 'expo-constants';

const YENTEN_BLOCKCHAIN_APP_ID = Constants.manifest.extra.blockchain.apiKey;

export interface AddressWithKey {
    address: string,
    key: string
}

export interface FeeEstimation{
    finalAmount: number,
    totalTransactionFee: number,
    minerFee: number,
    yVaultFee: number
}

export interface FiatBalance{
    USD: number,
    RUB: number
    EUR: number
}

export interface FiatBalances{
    default: string,
    balancePip: FiatBalance
}

abstract class CoinManager {
    MINER_FEE = 6e-3; // fee for miner who makes block with transaction
    TRANSACTION_FEE = 5e-1; // total transaction fee
    YVAULT_FEE = this.TRANSACTION_FEE - this.MINER_FEE; // transaction for yVault
    YVAULT_TRANSACTION_FEE_ADDRESS = Constants.manifest.extra.blockchain.feeAddress;
    CTRL = '0000XXXX';

    constructor() {
        apiClient.init(YENTEN_BLOCKCHAIN_APP_ID);
    }
    abstract newAddress(): AddressWithKey;

    _rng(size: number): Buffer {
        var bytes = Buffer.allocUnsafe(size);
        let randomBytesArray: Uint8Array = Random.getRandomBytes(size);
        for (var i = 0; i < randomBytesArray.length; ++i) {
            bytes[i] = randomBytesArray[i];
        }
        return bytes;
    }

    sha256(input:string, outputEncoding:"ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined='hex', inputEncoding:string='utf-8'):string{
        return yenten.crypto.sha256(Buffer.from(input,inputEncoding)).toString(outputEncoding);
    }

    encodePass(passphrase:string){
        return this.sha256(this.sha256(passphrase),'hex','hex');
    }

    encrypt(message:string, passphrase:string):string{
        return CryptoES.AES.encrypt(message, passphrase).toString();
    }

    decrypt(encrypted:string, passphrase:string):string{
        return CryptoES.AES.decrypt(encrypted, passphrase).toString(CryptoES.enc.Utf8);
    }

    lockWallet(address:string, wif:string, pass:string):Promise<void>{
        
        const encrypted = this.encrypt(this.CTRL+wif, pass);
        return AppManager.saveWallet(address, encrypted);
    }
    
    unlockWallet(address:string, pass:string):Promise<string>{
        let that = this;
        return AppManager.loadWallet(address).then((wallet:WalletData|undefined)=>{
            if(!wallet)
                return Promise.reject(`No wallet found ${address}`);
            const decrypted = that.decrypt(wallet.w, pass);
            if(!decrypted.startsWith(that.CTRL)){
                return Promise.reject(new Error('Invalid password'));
            }
            return decrypted.replace(that.CTRL,'');
        })
    }
    abstract fiatBalance(coinBalanceSat: number):Promise<FiatBalances>;
}

class YentenManager extends CoinManager {

    async fiatBalance(coinAmount: number):Promise<FiatBalances>{
        console.log('Fiat balance for coin amount: ', coinAmount);
        const exchangeRatesResponse:Response = await YentenAPI.getExchangeRates();        
        const defaultCurrencySetting:UserSetting|undefined = await AppManager.getUserSetting('defaults.fiatCurrency');

        let result:FiatBalances = {
            default: defaultCurrencySetting?defaultCurrencySetting.v:'EUR',
            balancePip: {
                EUR: 0,
                RUB: 0,
                USD: 0
            }
            
        }
        
        const fiats = ["USD","EUR","RUB"];

        fiats.forEach((item:string)=>{
            
            const fiatExchangeRate = exchangeRatesResponse.data.fiat.find((item2:any)=>{
                return item2.code == item
            }).er;

            result.balancePip[item as keyof FiatBalance] = fiatExchangeRate*exchangeRatesResponse.data.btc*coinAmount
        })

        return result;
    }

    addressFromPrivateKeyWIF(privateKeyWIF:string):AddressWithKey{
        const keyPair = yenten.ECPair.fromWIF(
            privateKeyWIF,
            yenten.networks.yenten
          );
          const { address } = yenten.payments.p2pkh({ pubkey: keyPair.publicKey, network: yenten.networks.yenten });
          let result: AddressWithKey = {
            address: address!,
            key: privateKeyWIF
        }
        return result;
    }

    newAddress(): AddressWithKey {
        const keyPair = yenten.ECPair.makeRandom({ network: yenten.networks.yenten, rng: this._rng });
        const { address } = yenten.payments.p2pkh({ pubkey: keyPair.publicKey, network: yenten.networks.yenten, });
        const privateKey = keyPair.toWIF()
        console.log('Address', address, privateKey)

        let result: AddressWithKey = {
            address: address!,
            key: privateKey
        }

        return result;
    }

    getTransaction(txid:string): Promise<Response>{
        return apiClient.getTransaction(txid);
    }

    getTransactions(address: string): Promise<Response> {
        return apiClient.getTransactions(address);
    }

    getBalance(address: string): Promise<Response> {
        return apiClient.getBalance(address);
    }

    getExchangeRates(): Promise<Response> {
        return apiClient.getExchangeRates();
    }

    generateOrderId(length:number){
        return Math.random().toString(36).substring(2, 2+length);
    }

    estimateFees(amountNetto: number):FeeEstimation{
        let that = this;        

        return {
            finalAmount: Math.max(amountNetto,0)+that.TRANSACTION_FEE ,
            totalTransactionFee: that.TRANSACTION_FEE,
            minerFee: that.MINER_FEE,
            yVaultFee: that.YVAULT_FEE
        }
    }

    getUnspents(address:string, amount:number):Promise<UnspentTransactionResponse>{
        return apiClient.getUnspent(address, amount).then((result:UnspentTransactionResponse)=>{
            return result;
        })
    }

    sendCoins(fromWIF:string, fromAddress: string, recipientAddress: string, amountNetto: number):Promise<SendTransactionResponse> {
        let that = this;
        let inputs: [{ hash: string, index: number, nonWitnessUtxo:any }?] = [];
        let inputsTotalSum: number = 0; // total amount of coins from all inputs
        let fees = that.estimateFees(amountNetto);
        console.log('Estimated fees ', fees)


        return apiClient.getUnspent(fromAddress, fees.finalAmount)
            .then((unspents: UnspentTransactionResponse) => {
                if (unspents.error) {
                    throw new Error(unspents.error.message);
                }
                // prepare input transactions
                unspents.data.txs.forEach((unspent: UnspentTransaction) => {
                    inputs.push({
                        hash: unspent.txid,                        
                        index: unspent.vout,
                        nonWitnessUtxo: Buffer.from(unspent.tex?.hex, 'hex')                        
                    })
                })
                return unspents;
            })
            .then((unspents: UnspentTransactionResponse) => {
                console.log('Unspents are ', unspents)
                // this is tricky, the sum may be much larger than the amount so be carefull when calculating change
                inputsTotalSum = unspents.data.sum!;
            })            
            //
            .then(() => {
                
                let psbt = new yenten.Psbt({ network: yenten.networks.yenten })
                    // @ts-ignore
                    .addInputs(inputs)  // add unspent inputs that sum up to the value greater than amountNetto + transaction fees
                    .addOutput({
                        address: recipientAddress,
                        value: Math.round(amountNetto*1e8), // 
                    }) // the actual "spend" 
                    .addOutput({
                        address: that.YVAULT_TRANSACTION_FEE_ADDRESS, // OR script, which is a Buffer.
                        value: Math.round(fees.yVaultFee*1e8), // 
                    }) // yVault transaction fee

                if(Math.round(inputsTotalSum*1e8) - Math.round(amountNetto*1e8) - Math.round(fees.totalTransactionFee*1e8)>=1e-8){
                    // we add spenders change only when its greater than 1 sat
                    psbt = psbt.addOutput({
                        address: fromAddress, // OR script, which is a Buffer.
                        value: Math.round(inputsTotalSum*1e8) - Math.round(amountNetto*1e8) - Math.round(fees.totalTransactionFee*1e8), // 
                    }) // sender's change = inputsTotal -amoun to send -yvault fee -miner fee                    

                }
                // psbt = psbt.addOutput({
                //         address: fromAddress, // OR script, which is a Buffer.
                //         value: Math.round(inputsTotalSum*1e8) - Math.round(amountNetto*1e8) - Math.round(fees.totalTransactionFee*1e8), // 
                //     }) // sender's change = inputsTotal -amoun to send -yvault fee -miner fee                    
                    //  fromPrivateKey(,{ network: yenten.networks.yenten }))
                psbt = psbt.signAllInputs(yenten.ECPair.fromWIF(fromWIF,yenten.networks.yenten));
                    
                let signaturesValidationResult = psbt.validateSignaturesOfAllInputs();
                if(!signaturesValidationResult)
                    throw new Error('Something wrong with input signatures');

                psbt.finalizeAllInputs();

                return psbt.extractTransaction().toHex();
            })
            .then((rawTransactionHex:string)=>{
                return apiClient.sendTransaction(that.generateOrderId(8),rawTransactionHex);
            })
            .then((sendTransactionResponse:SendTransactionResponse)=>{
                if(sendTransactionResponse.error){
                    throw new Error(sendTransactionResponse.error.message);
                }
                return sendTransactionResponse;
            })

    }
}

export const YentenAPI = new YentenManager();
