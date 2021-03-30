import React, { useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { Input } from 'galio-framework';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';
import {Button} from 'galio-framework'
import { View } from './Themed';

import {AddressWithKey, YentenAPI} from '../logic/CoinManager'
import { AppManager } from '../logic/AppManager';
import { ButtonCentered, ExplainerText, TextAreaCentered } from './Controlls';
import { useNavigation } from '@react-navigation/native';
import Distancer from './Distancer';
import { AlertInline, AlertInlineSuccess } from './AlertsInline';


interface Props {
  onComplete():void,
  // placeholder: string,
  // label: string,  
  // errorMsg: string,  
  // keyboard?: 'default'|'number-pad'|'decimal-pad'|'numeric'|'email-address'|'phone-pad',
  // minLength?:number,
  // maxLength?:number,
  // onValueEntered?:Function,
  // onValidationStateChanged?:Function,
  // masked?:boolean
}
const WalletConfigurator = (props: Props) => {
  const {onComplete} = props;

  
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isBusy, setIsBusy] = React.useState<boolean>(false); 
  const [WIF, setWIF] = useState<string>('');

  const buttons = ['New address', 'Use existing']

  const onChange = (selectedIndex:number)=>{
    setSelectedIndex(selectedIndex);  
  }

  const claimCTA = ()=>{
    AppManager.loadPin().then((pin:string|null)=>{
      let newAddress = YentenAPI.newAddress();
      console.log('Address', newAddress);
      return YentenAPI.lockWallet(newAddress.address, newAddress.key, pin!).then(()=>{
        return newAddress;
      });
    })
    .then((address:AddressWithKey)=>{
      console.log('Wallet created and saved', address);        
      onComplete();
    })
    
    
  }
  const onWifChanged = (value:string)=>{
    
    setErrorMsg('');
    setWIF(value);
  }

  const validate = ():boolean=>{
    const validFirstLetter =  WIF.trim().toUpperCase().startsWith('L') || WIF.trim().toUpperCase().startsWith('K');
    const minLength = WIF.trim().length>10;
    return validFirstLetter && minLength;
  }

  const importCTA = ()=>{
    const valid = validate();
    if(valid){
      AppManager.loadPin().then((pin:string|null)=>{
        const address = YentenAPI.addressFromPrivateKeyWIF(WIF.trim());
        console.log('Address', address);
        return YentenAPI.lockWallet(address.address, address.key, pin!).then(()=>{
          return address;
        });
      })
      .then((address:AddressWithKey)=>{
        console.log('Wallet imported and saved', address);          
        onComplete();
      }).catch((error:any)=>{
        setErrorMsg(error.message||error);
      })      
    }else{
      setErrorMsg('Invalid private key. Should start with K or L letter. Please check and try again.');
    }
  }

  // const checkIsReady = (value:string):boolean=>{
  //   let valid = true;
  //   if(minLength&&value&&value.length<minLength || minLength&&!value)
  //     valid = false
  //   if(maxLength&&value&&value.length>maxLength)
  //     valid = false
    
  //   setValid(valid);
  //   if(onValidationStateChanged)
  //     onValidationStateChanged(valid)
  //   return valid;
  // }

  return (
    <View style={styles.container}>      
      <Text h3>Configure your wallet</Text>
      <Text h6>Select how to setup your wallet address</Text>
      <ButtonGroup
        
        onPress={onChange}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{height: 50, width: '100%', marginVertical: 20}}
        buttonStyle={styles.buttons}
        selectedTextStyle={styles.selectedText}
        selectedButtonStyle={styles.selectedButtonStyle}
      />
    {selectedIndex==0?
    <>
      <Text>New Yenten address will be generated and stored in wallet.</Text>
      <Text>You can use the newly generated address for receiving and sending coins.</Text>
      <ButtonCentered label="Generate address" onPress={claimCTA}></ButtonCentered>      
    </>
    :
    <>
    {isBusy?
      <ActivityIndicator size="large" style={{paddingVertical:150}}/>
      :
      <>
      <ExplainerText msg={`You can use existing address for receiving and sending coins.`}></ExplainerText>
    <ExplainerText msg={`Please extract your address private key in WIF format and paste the key in the field below. The wallet will process the private key and import the address.`}></ExplainerText>    
    
    <TextAreaCentered label="Private key (WIF)" value={WIF} onChange={onWifChanged}></TextAreaCentered>
    <ButtonCentered label="Import address" onPress={importCTA}></ButtonCentered>
    {errorMsg?<AlertInline type={'warning'} title="Error importing key" msg={errorMsg}></AlertInline>:null}
    <Distancer distance={200}></Distancer>
    </>
    }
    
    
    </>
    }
    </View>    
  )
  
}


const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginTop: 20
  },
  buttons: {    

  },
  selectedText:{
    fontSize: 20
  },
  selectedButtonStyle:{
    backgroundColor: Colors.dark.rustyNail
  },
  pass: {
    fontSize: 20,

  },
  section: {
    width: '80%',
  },  
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
  textarea: {    
      height: 80,
      margin: 12,
      borderWidth: 1, 
      borderRadius: 5,      
      paddingHorizontal: 10   
  },
  separator: {
    marginTop: 200,
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})

export default WalletConfigurator;