import React from 'react';
import { StyleSheet } from 'react-native';


// import { Text, View } from '../components/Themed';
import { View } from '../components/Themed';
import { Text } from 'galio-framework';
import { ScrollView } from 'react-native'
import ImageTitled from '../components/ImageTitled'

import AfterDepositActions from '../components/AfterDepositActions'
import { useFocusEffect } from '@react-navigation/native';



export default function DepositSuccess({route}:{route:any}) {
  const { passport, trusteeEmail, maturityDateWeeks, priceFormatted, price } = route.params;

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
  // const [isNotReady, setIsNotReady] = React.useState<boolean>(true);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} scrollsToTop={true} showsVerticalScrollIndicator={false}>
        {/* <Text h3 style={styles.title}>Secure Your Yenten Wallet</Text> */}

        <ImageTitled title='' description='' width={155} height={135} asset='../assets/images/vault.png'></ImageTitled>


        <View style={styles.centered}>
          <Text h3>Deposit Success</Text>
        </View>
        <AfterDepositActions passport={passport} email={trusteeEmail} maturity={maturityDateWeeks} priceFormatted={priceFormatted} price={price}></AfterDepositActions>
        <View style={styles.centered}>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
      </ScrollView>
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
  },
  scroll:{
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
    shadowColor: '#899e8b',
    marginVertical: 20
  },
  ctaDisabled: {
    width: '100%',
    backgroundColor: '#B3B3B3',
    shadowColor: '#939393',
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
});
