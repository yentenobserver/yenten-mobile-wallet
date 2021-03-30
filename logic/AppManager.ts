import AsyncStorage from '@react-native-async-storage/async-storage';
import {CloudPassportEntity, PassportData, PendingOrder, UnlockPassportEntity, WalletData} from '../data/localStorage/Model'
import moment from 'moment'
import {Integrations} from './IntegrationManager'
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface Price {
    currency: string,
    formatted: string,
    value: number // satoshis 1e-8
}
export enum STATE_LISTENER_STATUS {
    NOT_READY,
    LISTENING
}

export enum APP_STATE {
    INACTIVE = 'inactive',
    BACKGROUND = 'background',
    ACTIVE = 'active'
}
class ApplicationManager {

    // currentAppStateHandler:STATE_LISTENER_STATUS = STATE_LISTENER_STATUS.NOT_READY;
    // appState:APP_STATE = APP_STATE.INACTIVE;
    // previousAppState:APP_STATE = APP_STATE.INACTIVE;

    // onForeground:{name:string, f:Function}[] = [];


    // addOnForegroundListener(listener:{name:string, f:Function}){
    //     let that = this;
    //     console.log('Adding foreground listener', listener);
    //     if(this.onForeground.findIndex((item:{name:string, f:Function})=>{return item.name == listener.name})==-1){
    //         that.onForeground.push(listener);
    //         console.log('Listener added', listener);
    //     }
    // }

    // handleAppStateChange(nextAppState:any){
    //     let that = this;
    //     this.currentAppStateHandler = STATE_LISTENER_STATUS.LISTENING;
    //     this.previousAppState = this.appState;
    //     this.appState = nextAppState;

    //     console.log('Listeners ', that.onForeground);

    //     if(this.previousAppState && this.previousAppState.match(/inactive|background/) && this.appState == 'active'){
            
    //         that.onForeground.forEach((item:{name:string, f:Function})=>{
    //             item.f(that.appState, that.previousAppState)
    //         })
    //     }
        
    // }

    checkPin(pincode:string):Promise<boolean>{
        let that = this;
        return that.loadPin().then((pin:string|null)=>{
            return pincode == pin;
        })
    }

    clearPendingOrders(ordersToRemove:PendingOrder[]):Promise<void>{        
        return this.loadPendingOrders().then((orders:PendingOrder[])=>{
            // remove pending orders that are marked for removal
            let filteredOrders = orders.filter((item:PendingOrder)=>{
                // leave others than ordersToremove
                return ordersToRemove.findIndex((inItem:PendingOrder)=>{return inItem.txid == item.txid}) == -1
            })

            return AsyncStorage.setItem('orders', JSON.stringify(filteredOrders));
        })
    }
    removePendingOrderByOid(oid:string):Promise<void>{

        return this.loadPendingOrders().then((orders:PendingOrder[])=>{
            console.log('Order before ', JSON.stringify(orders));
            const filteredOrders = orders.filter((item:PendingOrder)=>{
                return item.oid != oid
            })
            console.log('Order after ', JSON.stringify(filteredOrders));
            return AsyncStorage.setItem('orders', JSON.stringify(filteredOrders));
        })
    }
    savePendingOrder(amount: number, txid:string, oid:string):Promise<void>{
        return this.loadPendingOrders().then((orders:PendingOrder[])=>{
            // console.log('Passports', passports)
            if(!orders)
            orders = [];
            
            orders.push({
                value: amount,
                ct: Date.now(),
                txid: txid,
                oid: oid,
                _id: Math.random().toString(36).substring(2, 6)
            });
            return orders;
        })
        .then((orders:PendingOrder[])=>{            
            return AsyncStorage.setItem('orders', JSON.stringify(orders));
        })        
    }

    loadPendingOrder(txid:string):Promise<PendingOrder|undefined>{
        return this.loadPendingOrders().then((orders:PendingOrder[])=>{
            return orders.find((item:PendingOrder)=>{
                return item.txid == txid;
            })
        })
    }

    loadPendingOrders():Promise<PendingOrder[]>{
        return AsyncStorage.getItem('orders').then((item:string|null)=>{                      
            return JSON.parse(item?''+item:'[]');
        })
    }

    removePendingOrder(txid:string){
        return this.loadPendingOrders().then((orders:PendingOrder[])=>{
            const filtered = orders.filter((item:PendingOrder)=>{
                return item.txid != txid
            })
            return AsyncStorage.setItem('orders', JSON.stringify(filtered));

        })
    }

    savePin(pincode:string):Promise<void>{
        return SecureStore.setItemAsync('pin', pincode)
        // return AsyncStorage.setItem('pin', pincode);
    }
    loadPin():Promise<string|null>{
        // return AsyncStorage.getItem('pin');
        return SecureStore.getItemAsync('pin');
    }

    saveWallet(address:string, WIFEncrypted:string):Promise<void>{        
        return this.loadWallets().then((wallets:WalletData[])=>{
            // console.log('Passports', passports)
            if(!wallets)
            wallets = [];
            
            wallets.push({
                a: address,
                w: WIFEncrypted,
                ct: Date.now(),
                mt: Date.now(),                
            });
            return wallets;
        })
        .then((wallets:WalletData[])=>{
            // console.log('Updated passport list', passports);
            return AsyncStorage.setItem('wallets', JSON.stringify(wallets));
        })        
        
    }

    loadWallets():Promise<WalletData[]>{
        return AsyncStorage.getItem('wallets').then((item:string|null)=>{                      
            return JSON.parse(item?''+item:'[]');
        })
    }

    loadWallet(address:string):Promise<WalletData|undefined>{       
        return this.loadWallets().then((wallets:WalletData[])=>{
            const matching = wallets.find((item:WalletData)=>{
                return item.a == address
            })

            return matching;
        })     
    }
    /** 
     * Loads default wallet (if there is such wallet)
     */
    loadDefaultWallet():Promise<WalletData|undefined>{
        return this.loadWallets().then((wallets:WalletData[])=>{
            return wallets.length>0?wallets[0]:undefined;
        })
    }

    login(email:string, pin:string):Promise<void>{
        let that = this;
        // console.log('Log in user', email)
        return AsyncStorage.setItem('userEmail', email)
        .then(()=>{
            return that.savePin(pin);
        })        
    }
    loggedUser():Promise<string|null>{
        
        return AsyncStorage.getItem('userEmail').then((item:string|null)=>{
            // console.log('Logged user is', item);
            return item;
        })
    }

    signOut(){
        return AsyncStorage.removeItem('userEmail').then(()=>{
            // console.log('Signed out');
        })
    }
    _clearAll(){
        return AsyncStorage.clear().then(()=>{
            // console.log('Local data cleared');
        })
    }

    deletePassport(passport:string):Promise<void>{
        return this.loadPassports().then((passports:PassportData[])=>{
            // console.log('Passports', passports)
            if(!passports)
                passports = [];
            
            const filteredPassports = passports.filter((item:PassportData)=>{
                return item.passport!=passport
            })

            return filteredPassports;
        })
        .then((passports:PassportData[])=>{
            
            // console.log('Updated passport list', passports);
            return AsyncStorage.setItem('passports', JSON.stringify(passports));
        })
        .then(()=>{
            // console.log('Removed passport', passport);
        })
    }

    loadPassport(passport:string):Promise<PassportData|void>{                
        return this.loadPassports().then((items:PassportData[])=>{            
            const matchingPassport:PassportData|undefined = items.find((item:PassportData)=>{
                return item.passport == passport
            })
            return matchingPassport            
        })
    }

    loadPassports():Promise<PassportData[]>{
        return AsyncStorage.getItem('passports').then((item:string|null)=>{
            // console.log('Passports is', item);
            return JSON.parse(''+item);
        })
    }
    addPassport(name: string, passport:string, trusteeEmail:string, maturityDateWeeks:number){
        return this.loadPassports().then((passports:PassportData[])=>{
            // console.log('Passports', passports)
            if(!passports)
                passports = [];
            
            passports.push({
                name: name,
                passport: passport,
                email: trusteeEmail,
                maturity: maturityDateWeeks,
                created: Date.now()
            });
            return passports;
        })
        .then((passports:PassportData[])=>{
            // console.log('Updated passport list', passports);
            return AsyncStorage.setItem('passports', JSON.stringify(passports));
        })
    }

    /**
     * Returns human readable information about remaining time period to mature
     * @param now current timestamp
     * @param maturity 
     */
    maturityRemaining(maturityTimestamp:number, prefixed: boolean = false){   
        // console.log(maturityTimestamp, maturityTimestamp-moment().valueOf(), moment.duration(maturityTimestamp-moment().valueOf()));     
        return moment.duration(maturityTimestamp-moment().valueOf()).humanize(prefixed)
    }

    _formatCash(n:number, decimal: number = 2){
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(decimal) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(decimal) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(decimal) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(decimal) + "T";
    };
    

    getPrice(maturity:number, currency: string):Price{
        const prices = {
            '0': {
              ytn: 0,
              eur: 0,
              usd: 0,
              chf: 0
            },
            '52': {
              ytn: 2400*10e8,      
              usd: 20.5*10e8,
              eur: 18.5*10e8,
              chf: 18.5*10e8,
            },
            '156': {
              ytn: 7200*10e8,
              usd: 61.5*10e8,
              eur: 55.5*10e8,
              chf: 55.5*10e8,
            },
          }
        //   const formatter = new Intl.NumberFormat('en', {
        //     notation: 'compact',
        //   })
          const formatter = {
              format: this._formatCash
          }
          const pricesFormatted = {
            '0': {
              ytn: formatter.format(prices[0].ytn/10e8),
              eur: formatter.format(prices[0].eur/10e8),
              usd: formatter.format(prices[0].usd/10e8),
              chf: formatter.format(prices[0].chf/10e8)
            },
            '52': {
            ytn: formatter.format(prices[52].ytn/10e8),
            eur: formatter.format(prices[52].eur/10e8),
            usd: formatter.format(prices[52].usd/10e8),
            chf: formatter.format(prices[52].chf/10e8)
            },
            '156': {
            ytn: formatter.format(prices[156].ytn/10e8),
            eur: formatter.format(prices[156].eur/10e8),
            usd: formatter.format(prices[156].usd/10e8),
            chf: formatter.format(prices[156].chf/10e8)
            },
          }
          

          let priceFormatted = pricesFormatted[156].ytn;
          let price = prices[156].ytn;

          const priceFormattedPath = `pricesFormatted[${maturity}].${currency}`
          const pricePath = `prices[${maturity}].${currency}`

          try {
            priceFormatted = eval(priceFormattedPath);
            price = eval(pricePath);
          }catch(e){
            console.error(e);            
          }

          return {
              currency: currency,
              formatted: priceFormatted as string,
              value: price
          }

    }

    maturityToTimestamp(now: number, maturity:number):number{
        
        const yearsToAdd = Math.floor(maturity/52);
        const maturityTimestamp = moment.utc(now).add(yearsToAdd, 'y').valueOf();
        // console.log(now, maturity, yearsToAdd, maturityTimestamp)
        return maturityTimestamp
    }

    _devBackendStorePassport(id: string, unlockEmail:string,  keyUnlockShare: string, keyControllShare: string, maturity: number, created: number){
        const that = this;

        const data:CloudPassportEntity = {
            i: id,
            cs: keyControllShare,
            us: keyUnlockShare,   
            e: unlockEmail,         
            m: maturity,
            ct: created,
            mts: that.maturityToTimestamp(Date.now(), maturity)
        }
        return AsyncStorage.setItem('_dev/backend/passports/'+id, JSON.stringify(data)).then(()=>{
            // console.log('SERVER MOCK - stored', data);
        });
    }

    /**
     * Reads passport unlock data from server (mock). When not matured empty string controll
     * share is returned
     * @param id passport id     
     * @returns UnlockPassportEntity
     * @returns UnlockPassportEntity.cs empty string when not matured
     * @returns UnlockPassportEntity.mts timestamp when tha passport becomes mature
     */
    _devBackendReadPassport(id: string):Promise<UnlockPassportEntity>{
        const data:UnlockPassportEntity = {
            i: '',
            cs: '',
            m: 0,
            ct: 0,
            mts: Number.MAX_SAFE_INTEGER
        }
        return AsyncStorage.getItem('_dev/backend/passports/'+id).then((item:string|null)=>{            
            const fromServer:CloudPassportEntity = JSON.parse(''+item);
            data.i = fromServer.i;
            data.cs = Date.now()>=fromServer.mts?fromServer.cs:''; // when matured return cs otherwise return empty string
            data.m = fromServer.m;
            data.ct = fromServer.ct,
            data.mts = fromServer.mts
            // console.log('SERVER MOCK - loaded', data);
            return data;
        })
    }
}

export const AppManager = new ApplicationManager();