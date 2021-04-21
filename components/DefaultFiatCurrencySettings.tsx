import React, { useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';

import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';

import { View } from './Themed';


import { AppManager } from '../logic/AppManager';
import { UserSetting } from '../data/localStorage/Model';
import { ButtonCentered } from './Controlls';


interface Props {
  onCompleted:any
}
const DefaultFiatCurrencySettings = (props: Props) => {
  const {onCompleted} = props;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const buttons = ['EUR', 'RUB', 'USD']

  React.useEffect(() => {
    // load user preferred currency
    AppManager.getUserSetting('defaults.fiatCurrency').then((defaultCurrency:UserSetting|undefined)=>{
        if(defaultCurrency)
          setSelectedIndex(buttons.findIndex((item:string)=> {return item == defaultCurrency.v.toUpperCase()}))      
    })
  },[])

  const onChange = (selectedIndex:number)=>{
    setSelectedIndex(selectedIndex);  
    // save selected preferred currency
    AppManager.saveUserSetting({
      k: 'defaults.fiatCurrency',
      v: buttons[selectedIndex].toUpperCase()
    })
  }

  return (
    <View style={styles.container}>
      <Text h3>Choose fiat currency</Text> 
      <ButtonGroup
        onPress={onChange}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{marginTop: 20,height: 50, width: '100%'}}
        buttonStyle={styles.buttons}
        selectedTextStyle={styles.selectedText}        
        selectedButtonStyle={styles.selectedButtonStyle}        
      />
      <ButtonCentered label="Save & close" onPress={onCompleted}></ButtonCentered>        
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
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight:400
  },
  buttons: {    

  },
  
  selectedText:{
    fontSize: 16
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

export default DefaultFiatCurrencySettings;