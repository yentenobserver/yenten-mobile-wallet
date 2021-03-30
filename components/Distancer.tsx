import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';

export interface Props {
    distance: number
}
export default function Distancer(props:Props) {
    const {distance} = props;
    return (     
        <View style={[styles.separator,distance?{marginVertical: distance}:null]}>        
        </View>
    );
}
const styles = StyleSheet.create({
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
});
