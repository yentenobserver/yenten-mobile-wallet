import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Input } from 'galio-framework';
import Colors from '../../constants/Colors'

import { Text } from 'galio-framework';
import { Button } from 'galio-framework'
import { AppManager } from '../../logic/AppManager'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NumericInput from '../../components/NumericInput'



interface Props {
  backgroundColor: string
  iconName: any
  title: string,
  stepId: string,
  onStepComplete?:any
}
const GetEmail = (props: Props) => {
  const [userEmail, setUserEmail] = React.useState('');
  const [pin, setPIN] = React.useState('');
  const [isNotReady, setIsNotReady] = React.useState<boolean>(true);
  const [isBusy, setIsBusy] = React.useState<boolean>(false);
  const navigation = useNavigation();
  const [pinValid, setPinValid] = React.useState<boolean>(false);
  const {onStepComplete, stepId} = props;

  useFocusEffect(
    React.useCallback(() => {
      
      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])      
  );

  const mainCTA = () => {
    if(onStepComplete){
      onStepComplete(stepId, {email: userEmail.toLowerCase(), pin: pin})
    }
    // AppManager.login(userEmail.toLowerCase(), pin)
    // .then(() => {
    //   return
    // })
    // .then(()=>{
    //   // redirect
    //   navigation.navigate('Root');
    // });
  };
  const checkReadiness = () => {
    let valid = true;

    const eMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!userEmail.match(eMail)) {
      valid = false
    }
    return valid;
  };

  const inputEmail = (email:string) => {
    // clear email - whitespaces    
    setUserEmail(email.trim());
  }

  useEffect(() => {    
    const isReady = checkReadiness()&&pinValid;
    setIsNotReady(!isReady);
  }, [userEmail, pin, pinValid])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.backgroundColor
      }}
    >
      {isBusy ?
        <ActivityIndicator size="large" />
        :
        <View style={styles.section}>
          <Input style={styles.pass} placeholder="Will be used to unlock" email onChangeText={(text: string) => inputEmail(text)}
            value={userEmail} label="Your email" autoCapitalize='none' caretHidden={true}/>
          {isNotReady ? <Text muted>Please provide valid email.</Text> : null}

          <NumericInput errorMsg="Please enter 6 digit PIN" masked={true} label="Wallet PIN (6 digits)" placeholder="6 digits" maxLength={6} minLength={6} keyboard="number-pad" onValueEntered={setPIN} onValidationStateChanged={setPinValid}></NumericInput>

          
          {isNotReady ? null : <Button style={styles.cta} capitalize onPress={mainCTA}>Create yVault</Button>}
        </View>
      }      
    </View>
  );
}

const styles = StyleSheet.create({
  pass: {
    fontSize: 20,

  },
  section: {
    width: '80%',
  },
  cta: {
    width: '100%',
    marginHorizontal: 0,
    backgroundColor: Colors.light.rustyNail,
    shadowColor: '#ffc93c',
  }
})
export default GetEmail