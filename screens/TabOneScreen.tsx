import React, {useEffect} from 'react';
import { StyleSheet } from 'react-native';


// import { Text, View } from '../components/Themed';
import { View } from '../components/Themed';
import { Input} from 'galio-framework';

import { Text } from 'galio-framework';
import { Picker } from 'react-native'
import {ScrollView} from 'react-native'
import {ActivityIndicator} from 'react-native'
import {Button} from 'galio-framework'

import * as Random from 'expo-random';

import {BaseVaultClientInstance, Passport} from 'ytn-vault-react-native'

import {Settings} from '../logic/Settings'
import {Vault} from '../logic/VaultManager'
import {AppManager} from '../logic/AppManager'
import { useFocusEffect } from '@react-navigation/native';





export default function TabOneScreen({navigation}) {
  const [privateKey, setPrivateKey] = React.useState('');
  const [trusteeEmail, setTrusteeEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [maturityDateWeeks, setMaturityDateWeeks] = React.useState<string>('156');
  const [isNotReady, setIsNotReady] = React.useState<boolean>(true);
  const [isBusy, setIsBusy] = React.useState<boolean>(false);  

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
    setTimeout(()=>{
      BaseVaultClientInstance.provideRandomBytes(Random.getRandomBytes);
      const passport:Passport = BaseVaultClientInstance.createPassport(privateKey);     
      if(Settings.developmentMode){
        console.log('Passport', passport);
      } 
      // store passport server shares on server
      Vault.storePassport(name, passport, trusteeEmail, parseInt(maturityDateWeeks))
      .then(()=>{
        setIsBusy(false);        
        navigation.push('DepositSuccess',{passport: passport.p, trusteeEmail: trusteeEmail, maturityDateWeeks: maturityDateWeeks, priceFormatted: AppManager.getPrice(Number.parseInt(maturityDateWeeks),"ytn").formatted, price: AppManager.getPrice(Number.parseInt(maturityDateWeeks),"ytn").value});
      })            
    },5*1000)
    
    // console.log(shares);
    
  };

  const flyBy = (value: string) => {
    setMaturityDateWeeks(value);
  };
  useEffect(() => {
    AppManager.loggedUser().then((user:string|null)=>{
      setTrusteeEmail(''+user);
    })    
  },[])
  useEffect(() => {
    const isReady = checkReadiness();
    setIsNotReady(!isReady);
  },[privateKey,trusteeEmail,maturityDateWeeks])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPrivateKey('');
      setName('')
      setMaturityDateWeeks('156');
    });

    return unsubscribe;
  },[navigation])


  const checkReadiness = () => {    
    let valid = true;
    // console.log('Length', privateKey.length)
    if(privateKey.length!=52){
      valid = false;
      console.log('PK length failed', privateKey.length)
    }
      
    
    if(!privateKey.startsWith('K') && !privateKey.startsWith('K')){
      valid = false;
      console.log('PK prefix failed')
    }
      
    const eMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!trusteeEmail.match(eMail)){
      valid = false
      console.log('email failed')
    }

    if(name.length<=0){
      valid = false;
      console.log('name failed')
    }
      
    console.log('After validation', valid);
    return valid;
  };

  return (
    <View style={styles.container}>
      {isBusy?
      <ActivityIndicator size="large"/>
      :
      <ScrollView style={styles.scroll} scrollsToTop={true} showsVerticalScrollIndicator={false}>
      {/* <Text h3 style={styles.title}>Secure Your Yenten Wallet</Text> */}
      <Text h3>HODL Yenten Wallet</Text>
      <Input style={styles.pass} placeholder="Name of your yenten wallet" onChangeText={(text:string) => setName(text)}
      value={name} label="HODL name" />
      <Input style={styles.pass} placeholder="WIF Compressed (starting with K or L)" password viewPass onChangeText={(text:string) => setPrivateKey(text)}
      value={privateKey} label="Wallet private key"/>
      <Text muted>The key will be encrypted in the the Vault on your phone only. It is neither sent nor shared with anybody.</Text>
      <Text style={styles.inputLabel}>Maturity period & Price</Text>
      <Picker
        selectedValue={maturityDateWeeks}
        style={styles.maturity}
        onValueChange={(itemValue, itemIndex) => {setMaturityDateWeeks(itemValue);}}
      >
        <Picker.Item label="0 (for test only)" value="0" />  
        {/* <Picker.Item label="1 month (" value="4" />         */}
        {/* <Picker.Item label="6 months" value="24" /> */}
        <Picker.Item label={`1 year (YTN ${AppManager.getPrice(52,"ytn").formatted})`} value="52" />
        <Picker.Item label={`3 years (YTN ${AppManager.getPrice(156,"ytn").formatted})`} value="156" />
      </Picker>
      <Text muted>When maturity period is elapsed the Unlock email will be sent with the missing share needed to unlock the Vault. Until then no one, event the creator of the Vault, can unlock the private key.</Text>
      <Input style={styles.pass} editable={false} placeholder="some@email.com" onChangeText={(text:string) => setTrusteeEmail(text)}
      value={trusteeEmail} label="Unlock email" autoCapitalize='none'/>
      <Text muted>This email address will receive Key Unlock Share needed to unlock the Passport in the Vault when maturity is reached.</Text>      
      <View style={styles.centered}>
        <Button disabled={isNotReady} disabledStyle={styles.ctaDisabled} style={isNotReady?styles.ctaDisabled:styles.cta} capitalize onPress={mainCTA}>{isNotReady?'Please enter all required data':'Deposit in Vault'}</Button>
      </View>      
      <View style={styles.centered}>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
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
    paddingRight: '5%',        
  },
  scroll: {    
    flex:1,
    paddingTop: '10%',
    
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
