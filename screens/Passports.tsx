import React, {useEffect} from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';


// import { Text, View } from '../components/Themed';
import { View } from '../components/Themed';
import { Input} from 'galio-framework';

import { Text } from 'galio-framework';
import {ActivityIndicator} from 'react-native'
import {Vault} from '../logic/VaultManager'
import { FlatList } from 'react-native';
import { PassportData } from '../data/localStorage/Model';
import { AppManager } from '../logic/AppManager';
import { useFocusEffect } from '@react-navigation/native';


interface ItemData {
  passport: string
  name: any
}

interface ItemProps {
  item: any,
  onPress?: any,
  onLongPress?: any
}

function Item(props:ItemProps) {
  const {item, onPress, onLongPress} = props;

  const press = () => {
    if(onPress)
      onPress(item)
  }

  const longPress = () => {
    if(onLongPress)
      onLongPress(item.name, item.passport)
  }

  return (
    <View style={styles.listItem}>
      <Image source={require('../assets/images/vault.png')}  style={{width:30, height:30,borderRadius:30}} />
      <View style={styles.listItemText}>
        <Text style={styles.listItemTextHighlight}>{item.name}</Text>
        
        {/* <Text>Added: {new Date(item.created).toISOString().slice(0,10)}</Text> */}
        <Text>Matures: {new Date(AppManager.maturityToTimestamp(item.created, item.maturity)).toISOString().slice(0,10)} ({AppManager.maturityRemaining(AppManager.maturityToTimestamp(item.created, item.maturity),true)})</Text>
        <Text>{item.email}</Text>
      </View>
      <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}} onPress={press} onLongPress={longPress}>
        <Text style={styles.listItemAction}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}


export default function Passports({navigation}) {
  const [privateKey, setPrivateKey] = React.useState('');
  const [trusteeEmail, setTrusteeEmail] = React.useState('');
  const [maturityDateWeeks, setMaturityDateWeeks] = React.useState<string>('156');
  const [isNotReady, setIsNotReady] = React.useState<boolean>(true);
  const [isBusy, setIsBusy] = React.useState<boolean>(false);  
  const [passports, setPassports] = React.useState<PassportData[]>([]);

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

  const mainCTA = (a:PassportData) => {
    // console.log('PRESSED',a)
    // navigation.navigate('Unlock', {screen: 'TabTwoScreen', params: {
    //   passportPassed: a.passport
    // }})
    navigation.navigate('TabTwoScreen', {
      passportPassed: a.passport
    })
    // setIsBusy(true);
    // setTimeout(()=>{
    //   BaseVaultClientInstance.provideRandomBytes(Random.getRandomBytes);
    //   const passport:Passport = BaseVaultClientInstance.createPassport(privateKey);     
    //   if(Settings.developmentMode){
    //     console.log('Passport', passport);
    //   } 
    //   // store passport server shares on server
    //   Vault.storePassport(passport, trusteeEmail, parseInt(maturityDateWeeks))
    //   .then(()=>{
    //     setIsBusy(false);        
    //     navigation.push('DepositSuccess',{passport: passport.p, trusteeEmail: trusteeEmail, maturityDateWeeks: maturityDateWeeks})
    //   })            
    // },5*1000)
    
    // console.log(shares);
    
  };

  const removeCTA = (name:string, passport: string) => {
    
    // console.log('Going to remove', name, passport);
    Alert.alert(
      `Remove Passport ${name}?`,
      "This is irrevocable operation. When removed it will be impossible to unlock the passport. Are you sure you wish to remove?",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Remove!", onPress: () => AppManager.deletePassport(passport).then(()=>{
          refreshPassports()
        })}
      ],
      { cancelable: true }
    );

  }

  const flyBy = (value: string) => {
    setMaturityDateWeeks(value);
  };

  const refreshPassports = () => {
    setIsBusy(true);
      Vault.listPassports().then((passports:PassportData[])=>{
        // console.log('Got', passports);
        setPassports(passports)
        setIsBusy(false)
      })
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshPassports();
    });

    return unsubscribe;

    
  },[])

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setPrivateKey('');
  //     setMaturityDateWeeks('156');
  //   });

  //   return unsubscribe;
  // },[navigation])


  const checkReadiness = () => {    
    let valid = true;
    // console.log('Length', privateKey.length)
    if(privateKey.length!=52)
      valid = false;
    
    const eMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!trusteeEmail.match(eMail)){
      valid = false
    }

    // console.log('After validation', valid);
    return valid;
  };

  return (
    <View style={styles.container}>
      {isBusy?
      <ActivityIndicator size="large"/>
      :
      <>
        <Text h3>HODL Passports</Text>
        
        {passports&&passports.length>0?
        <>
        <Text>HODL Passports that are secured on this Device:</Text>
        <FlatList
        style={styles.list}
        data={passports}
        renderItem={({ item }) => <Item item={item} onPress={mainCTA} onLongPress={removeCTA}/>}
        keyExtractor={item => item.passport}
        /></>
        :<>
        <Text>Your HODL passport list is empty. You may start by adding new Yenten wallet on Store tab.</Text>
        {/* <View style={styles.centered}>
          <Button style={styles.cta} capitalize onPress={mainCTA}>{`Add new Yenten wallet`}</Button>
        </View> */}
        </>
        }
        
      </>      
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
  list: {
    flex:1, 
    minWidth:'100%'
  },
  listItem:{
    marginVertical:5,
    padding:10,
    backgroundColor:"#ddd",
    width:"100%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  listItemText:{
    marginLeft: 18,
    alignItems:"flex-start",
    flex:1,
    backgroundColor:"#ddd",
  },
  listItemTextHighlight:
  {
    fontWeight:"bold",
    fontSize: 12
  },
  listItemAction: {
    fontWeight:"bold",
    color:'#006400',
  }
});
