import React from 'react';
import { StyleSheet } from 'react-native'
import { Text } from 'galio-framework';
import { amountFromString } from '../logic/Calculator'
import { View } from 'react-native';

export interface AmountDisplayProps {
    value?: string, // decimal value
    unit: 'sat' | 'cents',
    colorMark?: boolean, // when true it will be green for positive number, red for negative
    currency?: string // when provided then currency sign is added
}
export const MediumAmountFromString = (props: AmountDisplayProps) => {
    const { value, unit, colorMark, currency} = props;
    const [colorMarkStyle, setColorMarkStyle] = React.useState<any>();

    React.useEffect(() => {  
        if(colorMark && amountFromString(value || '0', unit).value>=0){
            setColorMarkStyle(styles.greenText);
        }
        if(colorMark && amountFromString(value || '0', unit).value<0){
            setColorMarkStyle(styles.redText);
        }
      },[colorMark, value])

    return (
        <View style={styles.row}>
            <Text style={[styles.wholeMedium, colorMarkStyle]}>{amountFromString(value || '0', unit).decomposedText?.whole}</Text>
            <Text style={[styles.fractionMedium, colorMarkStyle]}>.{amountFromString(value || '0', unit).decomposedText?.fractional}{currency?' '+currency:''}</Text>
        </View>
    )
}
export const SmallAmountFromString = (props: AmountDisplayProps) => {
    const { value, unit, colorMark, currency } = props;
    const [colorMarkStyle, setColorMarkStyle] = React.useState<any>();

    React.useEffect(() => {  
        if(colorMark && amountFromString(value || '0', unit).value>=0){
            setColorMarkStyle(styles.greenText);
        }
        if(colorMark && amountFromString(value || '0', unit).value<0){
            setColorMarkStyle(styles.redText);
        }
      },[colorMark, value])

    return (
        <View style={styles.row}>
            <Text style={[styles.wholeSmall,colorMarkStyle]}>{amountFromString(value || '0', unit).decomposedText?.whole}</Text>
            <Text style={[styles.fractionSmall, colorMarkStyle]}>.{amountFromString(value || '0', unit).decomposedText?.fractional}{currency?' '+currency:''}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    wholeMedium: {

        alignSelf: 'baseline',
        fontSize: 18,
        fontWeight: 'bold',
    },
    fractionMedium: {

        alignSelf: 'baseline',
        fontSize: 14,
        fontWeight: 'normal',
    },
    wholeSmall: {

        alignSelf: 'baseline',
        fontSize: 14,
        fontWeight: 'bold',
    },
    fractionSmall: {

        alignSelf: 'baseline',
        fontSize: 10,
        fontWeight: 'normal',
    },
    redText: {
        color:'red',
    },
    greenText: {
        color:'green',
    }
})
