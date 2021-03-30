import React, { useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { Input } from 'galio-framework';
import { StyleSheet, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';
import {Button} from 'galio-framework'
import { View } from './Themed';

import {YentenAPI} from '../logic/CoinManager'
import { AppManager } from '../logic/AppManager';
import { WalletBalance, WalletData } from '../data/localStorage/Model';
import TransactionsList from './TransactionsList';
import TransactionForm from './TransactionForm';
import AcceptForm from './AcceptForm';

interface Props {
  wallet: WalletData,
  balance: WalletBalance,
  externalRecipientAddress?:string  // when the app is started after the yenten:// link

}
const WalletDetails = (props: Props) => {
  const {wallet, balance, externalRecipientAddress} = props;

  const [isValid, setValid] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(externalRecipientAddress?1:0);
  
  const buttons = ['Transactions', 'Pay with YTN', 'Receive YTN']

  const onChange = (selectedIndex:number)=>{
    setSelectedIndex(selectedIndex);  
  }
  
  const handleAfterTransaction = ()=>{
    setSelectedIndex(0);  
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
      <ButtonGroup
        onPress={onChange}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{height: 50, width: '100%'}}
        buttonStyle={styles.buttons}
        selectedTextStyle={styles.selectedText}
        selectedButtonStyle={styles.selectedButtonStyle}
      />
      {selectedIndex==0?<TransactionsList address={wallet.a}></TransactionsList>:null}
      {selectedIndex==1?<View style={{flex:1, alignSelf: 'stretch', marginHorizontal: 20}}><TransactionForm recipient={externalRecipientAddress} wallet={wallet} balance={balance} onReturn={handleAfterTransaction}></TransactionForm></View>:null}    
      {selectedIndex==2?<AcceptForm wallet={wallet}></AcceptForm>:null}
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

export default WalletDetails;