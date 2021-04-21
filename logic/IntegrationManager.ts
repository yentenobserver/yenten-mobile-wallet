import Communications from 'react-native-communications';
import { CloudPassportEntity, UnlockPassportEntity } from '../data/localStorage/Model';

import * as Device from 'expo-device';

import * as firebase from 'firebase';
import 'firebase/functions';

import Constants from 'expo-constants';

class IntegrationManager {
    
    firebaseConfig = {
        apiKey: Constants.manifest.extra.firebase.apiKey,
        authDomain: Constants.manifest.extra.firebase.authDomain,
        projectId: Constants.manifest.extra.firebase.projectId,
        storageBucket: Constants.manifest.extra.firebase.storageBucket,
        messagingSenderId: Constants.manifest.extra.firebase.messagingSenderId,
        appId: Constants.manifest.extra.firebase.appId
      };

    constructor() {
        // Initialize Firebase
        firebase.initializeApp(this.firebaseConfig);
    }


    sendSMS(msg: string, phoneNumber?: string) {
        Communications.text(phoneNumber, msg);
    }
    
    storePassport(passportId: string, passportName: string, unlockEmail: string, keyUnlockShare: string, keyControllShare: string, maturity: number, created: number): Promise<void> {
        
        const callable = firebase.functions().httpsCallable('storePassport')
        const data:any = {
            dto: {
                i: passportId,
                n: passportName,
                e: unlockEmail,
                us: keyUnlockShare,
                cs: keyControllShare,
                m: maturity,
                ct: created
            }
        }

        return callable(data).then(()=>{
            return;
        })
        // mocked
        // return AppManager._devBackendStorePassport(passportId, unlockEmail, keyUnlockShare, keyControllShare, maturity, created);
    }
    /**
     * 
     * @param passportId 
     * @returns remaining maturity
     * @returns key controll share
     */
    checkPassport(passportId: string): Promise<UnlockPassportEntity> {

        const callable = firebase.functions().httpsCallable('unlockPassport')
        const data:any = {
            dto: {
                i: passportId                
            }
        }

        return callable(data).then((result:any)=>{
            return result.data;
        })
        // mocked
        // return AppManager._devBackendReadPassport(passportId);
    }
}

export const Integrations = new IntegrationManager();