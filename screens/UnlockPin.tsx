import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors'
import { Text } from 'galio-framework';
import { AppManager } from '../logic/AppManager'
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import PinView from 'react-native-pin-view';
import { LogBox } from 'react-native';

interface Props {
  backgroundColor: string

}
const UnlockPin = (props: Props) => {
//   const [userEmail, setUserEmail] = React.useState('');
//   const [isNotReady, setIsNotReady] = React.useState<boolean>(true);
//   const [isBusy, setIsBusy] = React.useState<boolean>(false);
  const navigation = useNavigation();
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('');

//   const pinView = React.useRef(null)

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

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])
  
  const onPinEntered = (pincode:string, clearFunc:any) => {
    
    AppManager.checkPin(pincode).then((pinValid:boolean)=>{
        if(pinValid)
            navigation.navigate('Root')
        else{            
            setErrorMsg('Invalid PIN. Try again')
            setIsTyping(false);
            clearFunc();            
        }
    })
    
  }

  const onPinChanged = (pincode:string) => {
    
    setIsTyping(true);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: props.backgroundColor
      }}
    >      
    <View style={styles.section}>
          <Text style={styles.title}>Enter PIN</Text>
          <Text style={styles.subtitle}>Please enter the PIN to unlock app</Text>
          {!isTyping&&errorMsg?
          <Text style={styles.error}>{errorMsg}</Text>
          :null}
        </View>
      <PinView pinLength={6} onComplete={onPinEntered} onPress={onPinChanged}></PinView>
    </View>
  );
}

const styles = StyleSheet.create({
  pass: {
    fontSize: 20,

  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400'
  },
  error: {
    paddingTop:5,
    fontSize: 16,
    fontWeight: '800',
    color:'red'
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40
  },
  cta: {
    width: '100%',
    marginHorizontal: 0,
    backgroundColor: Colors.light.rustyNail,
    shadowColor: '#ffc93c',
  }
})
export default UnlockPin