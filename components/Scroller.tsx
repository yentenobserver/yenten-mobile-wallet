import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native'

export interface Props {
    children: any;
}
export default function Scroller(props:Props) {
    const {children} = props;  
    return (
        <ScrollView style={styles.scroll} scrollsToTop={true} showsVerticalScrollIndicator={false}>    
        {children}          
        </ScrollView>    
    );
}

const styles = StyleSheet.create({  
  scroll: {    
    flex:1,
    paddingTop: '3%'    
  }  
});
