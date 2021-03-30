import React, {useEffect}  from 'react';
import { StyleSheet, Alert } from 'react-native';

import { Text } from 'galio-framework';
import {ScrollView} from 'react-native'
import {ActivityIndicator} from 'react-native'
import { Input} from 'galio-framework';
import { View } from '../components/Themed';

import {Button} from 'galio-framework'

import {UnlockResult, Vault} from '../logic/VaultManager'
import {Settings} from '../logic/Settings'
import { useFocusEffect } from '@react-navigation/native';

export default function TabTwoScreen({route, navigation}) {  
  const [passport, setPassport] = React.useState('');
  const [maturityShare, setMaturityShare] = React.useState('');
  const [isBusy, setIsBusy] = React.useState<boolean>(false);
  const [isNotReady, setIsNotReady] = React.useState<boolean>(true);
  const [showWarning, setShowWarning] = React.useState<boolean>(false);

  // const { passportPassed} = route.params

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
    setIsBusy(true);
    Vault.unlockPassport(passport, {secret: {v: maturityShare}})
    .then((result:UnlockResult)=>{

      setIsBusy(false);
      if(result.status==0){
        if(Settings.developmentMode){
          console.log('Unlock success', result);
        }
        navigation.push('UnlockSuccess',{secret: result.contents})
      }else{
        if(Settings.developmentMode){
          console.log('Unlock error', result);
        }          
        Alert.alert(
          "Can't unlock",
          result.errorMsg,
          [
            {
              text: "Dismiss",                            
            }         
          ],
          { cancelable: false }
        );
      }        
      
    })
  };

  useEffect(() => {
    const isReady = checkReadiness();
    setIsNotReady(!isReady);
  },[passport,maturityShare])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // console.log('Rp',route.params);
      if(route.params&&route.params.passportPassed){
        setPassport(route.params.passportPassed)    
      }else{
        setPassport('');
      }      
      setMaturityShare('');
    });
    return unsubscribe;
  },[navigation])

  // useEffect(() => {
  //   console.log('RP',route.params);
    
  // },[JSON.stringify(route.params)])

  const checkReadiness = () => {    
    let valid = false;
    // if(Settings.developmentMode)
      // console.log(passport.length, maturityShare.length);
    valid = passport.length>0 && maturityShare.length>0;
    
    return valid;
  };

  return (
    <View style={styles.container}>
      {isBusy?
      <ActivityIndicator size="large"/>
      :
      <ScrollView style={styles.scroll} scrollsToTop={true} showsVerticalScrollIndicator={false}>
      {/* <Text h3 style={styles.title}>Secure Your Yenten Wallet</Text> */}
      <Text h3>Unlock Yenten Passport</Text>
      <Input style={styles.pass} placeholder="Should start with 'P' letter"  onChangeText={(text:string) => setPassport(text)}
      value={passport} label="Passport"/>
      <Text muted>If not selected on passports' list you should have received the passport directly from the person that created the passport (via SMS or by other means).</Text>      
      <Input style={styles.pass} placeholder="From Vault maturity notification email" onChangeText={(text:string) => setMaturityShare(text)}
      value={maturityShare} label="Unlock share"/>      
      <Text muted>Sent to you in email when passport is matured.</Text>
      <View style={styles.centered}>
        <Button disabled={isNotReady} disabledStyle={styles.ctaDisabled} style={isNotReady?styles.ctaDisabled:styles.cta} capitalize onPress={mainCTA}>{isNotReady?'Please provide passport and unlock share':'Unlock Passport'}</Button>
      </View>
      
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      
      {/* <Toast isShow={showWarning} positionIndicator="bottom" color="warning">This is a bottom positioned toast</Toast> */}
      </ScrollView>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  scroll: {
    paddingTop: '10%'
  },
  // scrollIn: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    width: '100%',
    backgroundColor: '#002244',
    shadowColor:'#899e8b',
    marginVertical: 20    
  },
  ctaDisabled: {
    width: '100%',  
    backgroundColor: '#B3B3B3',
    shadowColor:'#939393',
    marginVertical: 20,
  },
  maturity: {
    width: '100%'
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  pass: {
    fontSize: 20,
    width: '100%',
  },
  inputLabelWrapper: {    
    flex: 1,
    alignContent: 'center'
  },
  inputLabel: {
    fontWeight: '500',
    // marginVertical: 8,
    marginTop: 8,
    marginBottom: 0,
    paddingHorizontal: 16,
    textAlign: 'left',
    width: '100%'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
