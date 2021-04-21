import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Hello from './Hello'
import GetEmail from './GetEmail'
import {AppManager} from '../../logic/AppManager'
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors'
import SetPin from './SetPin';


interface Props {
  onOnboardingCompleted?:any
}
const Onboarding = (props: Props) => {
    const navigation = useNavigation();  
    const {onOnboardingCompleted} = props;
    
    const [email, setEmail] = useState<string>('');
    const [pin, setPIN] = useState<string>('');
    
    const handleEmail = (data:string) => {
      setEmail(data);
    }

    const handlePIN = (data:string) => {
      setPIN(data);
    }

    const onStepCompleted = (stepId: string, stepData:any) =>{
      if(stepId == 'get-email'){
        AppManager.login(stepData.email, stepData.pin)        
        .then(()=>{
          if(onOnboardingCompleted)
            onOnboardingCompleted()
        });
      }
    }

    // useEffect(() => {
    
    //     AppManager.loggedUser().then((user:string|null)=>{
    //       // console.log('Checked user', user)
    //       if(user) navigation.navigate('Root')
    //     })
    //   },[])
    return (
        <View style={{ flex: 1 }}>
          <ViewPager style={{ flex: 1 }} showPageIndicator={true}>
            <View key="1">
              <Hello
                backgroundColor={Colors.light.yellowSea}
                iconName="sun"
                title="Welcome to the yVault app"
                stepId='hello'                                
              />
            </View>
            <View key="2">
              <GetEmail
                backgroundColor={Colors.light.yellowSea}
                iconName="sun"
                title="Welcome to the weather app"
                stepId='get-email'
                onStepComplete={onStepCompleted}
              />
            </View>
            {/* <View key="3">
              <SetPin
                backgroundColor={Colors.light.yellowSea}
                iconName="sun"
                title="Welcome to the weather app"
                
              />
            </View> */}
            
          </ViewPager>
        </View>
      );
}

export default Onboarding