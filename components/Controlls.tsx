import React, { useEffect, useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { Input } from 'galio-framework';
import { StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';
import {Button} from 'galio-framework'
import { View } from './Themed';

import TextInput from './TextInput';

interface ButtonCenteredProps {
    label?: string,
    onPress?: Function,  
}
export const ButtonCentered = (props: ButtonCenteredProps) => {
    const {onPress, label} = props;

  return (
    <View style={styles.centered}>
        <Button style={styles.cta} capitalize onPress={onPress?onPress:null}>{label}</Button>
    </View>
  )  
}

interface TextAreaCenteredProps {
  label?:string,
  value: string,
  onChange?: Function,  
}
export const TextAreaCentered = (props: TextAreaCenteredProps) => {
  const {value, onChange, label} = props;

return (
  <>
  {label?<Text style={styles.inputLabel}>{label}</Text>:null}
  <View style={styles.centered}>
      <TextInput
      style={styles.textarea}
    multiline={true}
    numberOfLines={4}
    onChangeText={(text:string) => onChange?onChange(text):null}
    value={value}/>
  </View>
  </>
)  
}
interface ExplainerTextProps {
  msg:string  
}
export const ExplainerText = (props: ExplainerTextProps) => {
  const {msg} = props;

return (
  <Text style={styles.textExplainer}>{msg}</Text>
)  
}


const styles = StyleSheet.create({
    textExplainer: {
      textAlign: 'left', 
      width: '100%'
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      },
      cta: {
        width: '100%',
        backgroundColor: '#002244',
        shadowColor:'#899e8b',
        marginVertical: 20    
      },
      textarea: {    
        height: 60,
        margin: 2,
        borderWidth: 1, 
        borderRadius: 5,      
        paddingHorizontal: 10   
    },
    inputLabel: {
      fontWeight: '500',
      // marginVertical: 8,
      marginTop: 8,
      marginBottom: 0,
      paddingHorizontal: 16,
      textAlign: 'left',
      width: '100%'
    }
})
