import Communications from 'react-native-communications';
import { CloudPassportEntity, UnlockPassportEntity } from '../data/localStorage/Model';

import * as Device from 'expo-device';

import * as firebase from 'firebase';
import 'firebase/functions';




class IntegrationManager {
    
    // firebaseConfig = {
    //     apiKey: 'api-key',
    //     authDomain: 'project-id.firebaseapp.com',
    //     databaseURL: 'https://project-id.firebaseio.com',
    //     projectId: 'project-id',
    //     storageBucket: 'project-id.appspot.com',
    //     messagingSenderId: 'sender-id',
    //     appId: 'app-id',
    //     measurementId: 'G-measurement-id',
    // };
    firebaseConfig = {
        
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