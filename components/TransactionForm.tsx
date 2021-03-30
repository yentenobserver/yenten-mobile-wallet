import React, { useEffect, useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { ActivityIndicator, StyleSheet} from 'react-native';
import { View } from './Themed';

import {FeeEstimation, YentenAPI} from '../logic/CoinManager'
import { AppManager } from '../logic/AppManager';
import { WalletBalance, WalletData } from '../data/localStorage/Model';
import TextInput from './TextInput';
import Distancer from './Distancer';
import Scroller from './Scroller';
import { Amount, amountFromString } from '../logic/Calculator';
import { ButtonCentered } from './Controlls';
import { AlertInline, AlertInlineSuccess } from './AlertsInline';
import { SendTransactionResponse } from 'yenten-api-blockchain';
import { useNavigation } from '@react-navigation/native';

interface Props {
  wallet: WalletData,
  balance: WalletBalance,
  recipient?:string,  // recipient address
  onReturn?():any;
}
const TransactionForm = (props: Props) => {
  const {wallet, balance, onReturn, recipient} = props;
  // const DEFAULT_FEE_SATOSHIS = 0.5e8; 
  const [isBusy, setIsBusy] = React.useState<boolean>(false);  

  const [recipientAddress, setRecipientAddress] = useState<string>(recipient||'');
  const [amountString, setAmountString] = useState<string>('');
  const [amount, setAmount] = useState<Amount>({text: '', value:0});
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [sentMsg, setSentMsg] = useState<string>('');
  const [isValid, setValid] = useState<boolean>(false);
  const [valueEntered, setValueEntered] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [feeEstimate, setFeeEstimate] = useState<FeeEstimation>({
    finalAmount:0,
    minerFee: 0,
    totalTransactionFee: 0,
    yVaultFee: 0
  });
  const navigation = useNavigation();
  

  useEffect(() => {  
    revalidate();
  },[JSON.stringify(amount),recipientAddress])

  const revalidate = ()=>{
    let valid = true;
    // not enough money
    if(amount.value+feeEstimate.totalTransactionFee>amountFromString(balance.data.balance.toString()).value){
      valid = false
      setErrorMsg('Insufficient funds. Transaction amount is greater than available balance.')
    }
    if(amount.value<=0){
      valid = false
      setErrorMsg('Please provide amount to be sent.')
    }
      
    if(!recipientAddress || !recipientAddress.toUpperCase().startsWith('Y')){
      valid = false
      setErrorMsg('Invalid recipient address. Only segwit addressess starting with \'Y\' letter are supported.')
    }
      
    setValid(valid);
  }

  const mainCTA = ()=>{
    setIsBusy(true);
    return AppManager.loadPin()
    .then((pin:string|null)=>{   
        
      return YentenAPI.unlockWallet(wallet.a, pin!)
    })
    .then((wif:string)=>{
      // console.log('Got WIF ', wif)
      return YentenAPI.sendCoins(wif, wallet.a, recipientAddress, amount.value/1e8);
    })
    .then((txResponse:SendTransactionResponse)=>{
      console.log(txResponse);
      setTransactionId(txResponse.data.txid!);
      setOrderId(txResponse.data.orderId!);
      return AppManager.savePendingOrder(-feeEstimate.finalAmount, txResponse.data.txid!, txResponse.data.orderId!);      
    })
    .then(()=>{
      setSentMsg('Transaction was sent successfully. It usually takes about 2 minutes to propagate it over the network. Pending order is registered on transaction list.');      
    })
    .catch((error:any)=>{
      console.log(error, error.message);
      setValid(false);
      setErrorMsg(error.message||error);
    })
    .finally(()=>{
      setIsBusy(false);
    })

    
    
    
  }  

  const onRecipientEntered = (address:string)=>{
    setRecipientAddress(address)
    setValueEntered(true);    
  }

  const onValidityChanged = (valid:boolean)=>{
    console.log('onvaliditychanged', valid);
    revalidate();
  }
  const onAmountEntered = (amount:string)=>{
    setValueEntered(true);
    setAmountString(amount);
    setAmount(amountFromString(amount));
    console.log('Amount is ', amount, amountFromString(amount));
    const feeEstimation = YentenAPI.estimateFees(amountFromString(amount).value/1e8);
    console.log('Estimated fee: ', feeEstimation);
    setFeeEstimate(feeEstimation);
    console.log(wallet.a);
  }

  const handleReturn = ()=>{
    setValueEntered(false);
    setAmount(amountFromString('0'));
    setErrorMsg('');
    setSentMsg('')
    if(onReturn) onReturn();
  }


  

  return (
    <View style={styles.container}>
      {isBusy?
      <ActivityIndicator size="large" style={{paddingVertical:150}}/>:
      <>
      <Scroller>
        <Text h3>Payment</Text>   
        <TextInput label="Recipient address" placeholder="Starting with Y" minLength={8} autoCapitalize="characters" errorMsg="Please provide valid recipient address" onValidationStateChanged={onValidityChanged} onValueEntered={onRecipientEntered} customValidator={(input:string)=>{return !input.toUpperCase().startsWith('Y')}} value={recipientAddress}></TextInput>
        <TextInput label="Amount" placeholder="Amount to send" minLength={1} maxLength={7+8+1} errorMsg="Please provide valid amount" onValidationStateChanged={onValidityChanged} onValueEntered={onAmountEntered} customValidator={(input:string)=>{return !isNaN(parseFloat(input))}} keyboard="decimal-pad"></TextInput>
        <View style={styles.amountContainer}>
          <Text>Transaction fee:</Text>
          <Text>{feeEstimate.totalTransactionFee.toFixed(8)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text>Transaction amount (amount+fee):</Text>
          <Text>{feeEstimate.finalAmount.toFixed(8)}</Text>          
        </View>
        <View style={styles.amountContainer}>
          <Text>Remaining balance:</Text>
          <Text>{(balance.data.balance-feeEstimate.finalAmount).toFixed(8)}</Text>          
        </View>
        {sentMsg?
        <AlertInlineSuccess title="Money sent" msg={sentMsg}>
          <Text style={{paddingVertical:10}} selectable>TransactionId: {transactionId}</Text>
          <Text style={{paddingVertical:10}} selectable>OrderId: {orderId}</Text>
          <ButtonCentered label="Go to transactions" onPress={handleReturn}></ButtonCentered>        
        </AlertInlineSuccess>
        :
        <>
        {isValid&&valueEntered?<ButtonCentered label="Send" onPress={mainCTA}></ButtonCentered>:null}
        {!isValid&&valueEntered?<AlertInline title="Invalid transaction data" msg={errorMsg} type="warning"></AlertInline>:null}
        </>
        }
        
        <Distancer distance={100}></Distancer>
      </Scroller>   
      </>}
      
      
    </View>   
  )
  
}


const styles = StyleSheet.create({
  // container: {
  //   flexDirection:'column',
  //   flexWrap: 'nowrap',
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   alignContent: 'flex-start',
  //   marginVertical: 20,             
  //   alignSelf: 'stretch'  
  // }
  container: {  
    flex: 1   
  },
  amountContainer: {
    flexDirection:'row',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginVertical: 5,                 
  }
})

export default TransactionForm;