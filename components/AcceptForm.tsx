import React, { useEffect, useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { StyleSheet} from 'react-native';
import { View } from './Themed';
import TextInput from './TextInput';
import Distancer from './Distancer';
import Scroller from './Scroller';
import { WalletData } from '../data/localStorage/Model';
// const QRCode =require('react-native-qrcode');
import QRCode from 'react-native-qrcode-svg';
import Colors from '../constants/Colors';


interface Props {
  wallet: WalletData,
}
const AcceptForm = (props: Props) => {
  const {wallet} = props;
  // console.log(`yenten://${wallet.a}`);
  return (
    <View style={styles.container}>
      
      <Scroller>
        {/* <Text h3>Receive address</Text>            */}
        <Text style={{paddingVertical:20}}>Copy the address below and send it to the person that is willing to send you coins:</Text>
        <Text style={{paddingVertical:20, fontSize: 18, backgroundColor: Colors.light.yellowSea, textAlign:'center'}} selectable >{wallet.a}</Text>
        <Text style={{paddingVertical:20}}>Or let her scan the qrcode below:</Text>     
        <View style={styles.centered}>
        <QRCode value={`yenten://${wallet.a}`}
          size={150} color={Colors.light.rustyNail}></QRCode>
        </View>   
        <Distancer distance={100}></Distancer>
      </Scroller>             
    </View>   
  )
  
}


const styles = StyleSheet.create({
  // container: {
  //   flexDirection:'column',
  //   flexWrap: 'nowrap',
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   alignContent: 'flex-start',
  //   marginVertical: 20,             
  //   alignSelf: 'stretch'  
  // }
  container: {  
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 20
  },
  amountContainer: {
    flexDirection:'row',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginVertical: 5,                 
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default AcceptForm;