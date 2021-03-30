import {VaultShare} from 'ytn-vault-react-native'
import {BaseVaultClientInstance, Passport, PassportParts} from 'ytn-vault-react-native'
import { PassportData, UnlockPassportEntity } from '../data/localStorage/Model'
import {Settings} from '../logic/Settings'
import {AppManager} from './AppManager'
import {Integrations} from './IntegrationManager'
import moment from 'moment'

export interface CheckResult {
    share: VaultShare|undefined, // when matured share is returned, otherwise its undefined
    mt: number // timestamp when the share will be mature and returned
}
export interface UnlockResult {
    errorMsg: string,
    status: number,
    contents: string
}

class VaultManager {
    storePassport(name: string, passport:Passport, trusteeEmail:string, maturityDateWeeks:number):Promise<void>{
        
        return Integrations.storePassport(passport.i, name, trusteeEmail, passport.v[0].secret.v, passport.v[1].secret.v, maturityDateWeeks, Date.now())        
        .then(()=>{
            // console.log('Stored on server', passport, trusteeEmail, maturityDateWeeks)
            return AppManager.addPassport(name, passport.p, trusteeEmail, maturityDateWeeks);
        })        
    }
    listPassports():Promise<PassportData[]>{
        return AppManager.loadPassports();
    }

    _checkPassport(decodedPassport:PassportParts):Promise<CheckResult>{
        return Integrations.checkPassport(decodedPassport.i).then((unlockData:UnlockPassportEntity)=>{            
            const r:CheckResult = {
                share: unlockData.cs?{secret: {v:unlockData.cs}}:undefined,
                mt: unlockData.mts
            }    

            return r;
        })        
    }

    unlockPassport(passportEncoded:string, unlockShare:VaultShare):Promise<UnlockResult>{
        let unlockResult:UnlockResult = {
            errorMsg: '',
            status: 1,
            contents: ''
        }
        
        const decodedPassport:PassportParts = BaseVaultClientInstance.decodePassport(passportEncoded)
        
        // get the share from server using passport 
        return this._checkPassport(decodedPassport)
        .then((serverShare:CheckResult)=>{
            if(Settings.developmentMode)
                console.log('Check passport result', serverShare)
            if(moment().valueOf()<serverShare.mt){
                // the passport is inmature
                unlockResult.status = 2;
                unlockResult.errorMsg = `Passport is inmature, try again after ${AppManager.maturityRemaining(serverShare.mt)}.`
                return unlockResult;
            }
            if(!serverShare.share){
                unlockResult.errorMsg = 'There seems to be something wrong with the passport'
                unlockResult.status = 1
                return unlockResult;
            }
            // try unlocking
            const result:string = BaseVaultClientInstance.unlockWithPassport(unlockShare, serverShare.share!, passportEncoded);
            unlockResult.contents = result;
            unlockResult.status = 0
            unlockResult.errorMsg = 'Unlocked successfully'
            return unlockResult;
        })
        .catch((error:any)=>{
            // on any error result error unlock result
            unlockResult.errorMsg = 'Error unlocking passport';
            unlockResult.status = 999999;
            return unlockResult
        })
    }
}

export const Vault = new VaultManager();