import React, { useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { Input } from 'galio-framework';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

interface Props {
  placeholder: string,
  label: string,  
  errorMsg: string,  
  keyboard?: 'default'|'number-pad'|'decimal-pad'|'numeric'|'email-address'|'phone-pad',
  minLength?:number,
  maxLength?:number,
  onValueEntered?:Function,
  onValidationStateChanged?:Function,
  masked?:boolean
}
const NumericInput = (props: Props) => {
  const {masked, errorMsg, keyboard,maxLength, label, placeholder, minLength, onValueEntered, onValidationStateChanged} = props;

  const [isValid, setValid] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');

  const onChange = (data:string)=>{
    
    setValue(data);
    if(checkIsReady(data)&&onValueEntered)
      onValueEntered(data);
  }

  const checkIsReady = (value:string):boolean=>{
    let valid = true;
    if(minLength&&value&&value.length<minLength || minLength&&!value)
      valid = false
    if(maxLength&&value&&value.length>maxLength)
      valid = false
    
    setValid(valid);
    if(onValidationStateChanged)
      onValidationStateChanged(valid)
    return valid;
  }

  return (
    <>
    {masked?
    <>
    <Input style={styles.pass} placeholder={placeholder} password onChangeText={(text: string) => onChange(text)}
    value={value} label={label} autoCapitalize='none' keyboardType={keyboard?keyboard:'default'} maxLength={maxLength||100000000}/>
    {!isValid ? <Text muted>{errorMsg}</Text> : null}
      </>
    :
    <>
    <Input style={styles.pass} placeholder={placeholder} onChangeText={(text: string) => onChange(text)}
    value={value} label={label} autoCapitalize='none' keyboardType={keyboard?keyboard:'default'}/>
    {!isValid ? <Text muted>{errorMsg}</Text> : null}
      </>}
    </>    
  )
  
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

export default NumericInput;