import React, {useEffect} from 'react';
import { Dimensions, StyleSheet } from 'react-native';



import { View } from '../../components/Themed';
import {ScrollView} from 'react-native'
import {ActivityIndicator} from 'react-native'
import {AppManager} from '../../logic/AppManager'
import { useFocusEffect } from '@react-navigation/native';


import CardRow, {CardDoubleRow, CardRowDoubleRight} from '../../components/CardRow'
import { UserSetting, UserSettings, WalletBalance, WalletData } from '../../data/localStorage/Model';
import WalletConfigurator from '../../components/WalletConfigurator';
import {FiatBalance, FiatBalances, YentenAPI} from '../../logic/CoinManager'
import TransactionsList from '../../components/TransactionsList';
import WalletDetails from '../../components/WalletDetails';
import { Button } from 'react-native-elements';
import Colors from '../../constants/Colors';


export default function WalletScreen({route, navigation}) {
  // when scanned qr code with yenten://ADDRESS link this will trigger the payment screen
  // const {recipientAddress} = route.params;
  // console.log('External recipient ', recipientAddress);  
  
  const recipientAddress = route.params?route.params.recipientAddress:undefined;
  const fromConfiguration = route.params?route.params.configured:undefined;
  const [isBusy, setIsBusy] = React.useState<boolean>(false);
  const [wallet, setWallet] = React.useState<WalletData>()
  const [fiatBalance, setFiatBalance] = React.useState<number>();
  const [fiatCurrency, setFiatCurrency] = React.useState<string>('EUR');

  const [walletBalance, setWalletBalance] = React.useState<WalletBalance>({
    data: {
      address: 'notset',
      balance: 0.00000000,
      received: 0,
      spent: 0,
      time: Date.now()
    }
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button buttonStyle={{backgroundColor: Colors.dark.rustyNail}} containerStyle={{paddingRight: 10}} onPress={() => { navigation.push('MenuScreen')}} title="..." />
      ),
    });
  }, [navigation]);

  useFocusEffect(    
    React.useCallback(() => {
      
      // console.log('Screen focused',walletBalance)
      recalculateFiatBalance()
      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])      
  );

  const refresh = ()=>{
    AppManager.loadWallets().then((wallets:WalletData[])=>{      
      if(wallets.length>0){        
        setWallet(wallets[0]);                         
        YentenAPI.getBalance(wallets[0].a)
        .then((balanceResponse:any)=>{  
          //balanceResponse.data.balance=100  
          setWalletBalance(balanceResponse);                               
        })                
      }
    })
  }

  const recalculateFiatBalance = ()=>{ 
    if(walletBalance.data.balance>0){
      YentenAPI.fiatBalance(walletBalance.data.balance).then((balance:FiatBalances)=>{
        // const x2 = ''+walletBalance.data.balance
        setFiatCurrency(balance.default);
        setFiatBalance(balance.balancePip[balance.default as keyof FiatBalance]);
        // console.log('fiat', x2, balance, balance.default, balance.balancePip[balance.default as keyof FiatBalance]);
      })
      // console.log('Current fiat balance: ',fiatBalance, exchangeCourseResponse.data.btc, walletBalance.data.balance, fiatExchangeRate, defaultCurrency);
    }      
  }  

  useEffect(() => {        
    recalculateFiatBalance();    
  },[walletBalance])
  
  // refreshTransactions(() => {    
  //   if(wallet){         
  //     YentenAPI.getBalance(wallet!.a).then((balanceResponse:any)=>{      
  //       setWalletBalance(balanceResponse);        
  //     })      
  //   }      
  // },[wallet])

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh,40000);
    return () => clearInterval(interval);
  },[])

  
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setPrivateKey('');
  //     setName('')
  //     setMaturityDateWeeks('156');
  //   });

  //   return unsubscribe;
  // },[navigation])


  

  return (
    <View style={styles.container}>
      {isBusy?<ActivityIndicator size="large"/>:null}     
      <CardRowDoubleRight leftMsg="YTN" rightMsg={walletBalance.data.balance.toFixed(8)} rightMsg2={fiatBalance?.toFixed(2)} rightCurrency={fiatCurrency}  imageURL="https://yentencoin.info/images/logo.png"></CardRowDoubleRight>                         
      
      
        

        {/* <CardRow leftMsg="YTN" rightMsg={walletBalance.data.balance.toFixed(8)}  imageURL="https://yentencoin.info/images/logo.png"></CardRow>
        <View style={styles.centered}>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>             */}
      {wallet?<>
        
      <WalletDetails wallet={wallet} balance={walletBalance} externalRecipientAddress={recipientAddress}></WalletDetails>
      </>
      :
      <>
      <ScrollView style={styles.scroll} scrollsToTop={true} showsVerticalScrollIndicator={false}>              
      {/* <View style={styles.centered}>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View> */}
        <WalletConfigurator onComplete={refresh}></WalletConfigurator>
        </ScrollView>    
      </>
      }            
    </View>
  );
}

const styles = StyleSheet.create({
  
  
  
  container: {
    flexDirection:'column',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    paddingLeft: '5%',
    paddingRight: '5%',   
    // backgroundColor: colors.light.rustyNail 
  },
  scroll: {    
    flex:1,
    paddingTop: '2%',
    width: '100%',
    
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
    shadowColor:'#899e8b',
    marginVertical: 20    
  },
  ctaDisabled: {
    width: '100%',  
    backgroundColor: '#B3B3B3',
    shadowColor:'#939393',
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
