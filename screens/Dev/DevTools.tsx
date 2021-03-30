import React, {useEffect} from 'react';
import { FlatList, StyleSheet } from 'react-native';


// import { Text, View } from '../components/Themed';
import { View } from '../../components/Themed';

import { Text } from 'galio-framework';
import {ActivityIndicator} from 'react-native'

import { AppManager } from '../../logic/AppManager';
import { List, ListItemData } from '../../components/Lists';
import { Alert } from 'react-native';
import Clipboard from 'expo-clipboard';
import {YentenAPI} from '../../logic/CoinManager'
import { WalletData } from '../../data/localStorage/Model';
import { useFocusEffect } from '@react-navigation/native';

import { Settings } from '../../logic/Settings';



export default function DevTools({route, navigation}) {  
  const [isBusy, setIsBusy] = React.useState<boolean>(false);  
  const [options, setOptions] = React.useState<ListItemData[]>([]);

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

  const loadWalletWIF = () =>{
    let walletPin:string = '';
    let wallet:WalletData|undefined = undefined;

    return AppManager.loadPin()    
    .then((pin:string|null)=>{ 
      walletPin = pin||'';          
      return AppManager.loadDefaultWallet();
    })
    .then((walletData:WalletData|undefined)=>{
      wallet = walletData;
      return YentenAPI.unlockWallet(wallet!.a, walletPin).then((wif:string)=>{
        return {
          w: wallet!,
          p: wif
        }
      })
    })
  }

  const exportAddress = () => {
    let walletPin:string = '';
    let wallet:WalletData|undefined = undefined;

    return loadWalletWIF()
    .then((result:{w: WalletData, p:string})=>{
      Clipboard.setString(result.p);
      Alert.alert(
        `Private key exported!`,
        `Private key for address: \n \n${result.w.a}\n \n was copied to clipboard.`,
        [
          {
            text: "Thanks"            
          },          
        ],
        { cancelable: true }
      );  
    })
          
  };

  const unbindCTA = () => {
    Alert.alert(
      `Unbind address?`,
      `This is irrevocable operation. When clicked the wallet will reset so make sure that you have exported your private key ot the coins may be lost. Are you sure you wish to unbind?`,
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Unbind!", onPress: () => {
          setIsBusy(true); 
          AppManager._clearAll().then(()=>{
            setIsBusy(false); 
          })
        }}
      ],
      { cancelable: true }
    );        
  };

  useEffect(() => {
    let optionsBuilder:ListItemData[] = [
      
      {id:'address_export', s1:'ADDRESS EXPORT', s2:'When clicked your address private key will be copied to Clipbord', a:'Export'},
      // {id:'address_hodl', s1:'HODL IN COLD WALLET', s2:'When clicked your wallet will be send to COLD WALLET for safe storage.', a:'Send to Cold Wallet'},
      // {id:'unbind', s1:'ADDRESS BINDING', s2:'When clicked you will securely erase your wallet data from this device. NOTICE this is irreversible operation, you may loose your coins.', a:'Unbind'}
    ];   
    if(Settings.developmentMode){
      optionsBuilder.push({id:'unbind', s1:'ADDRESS BINDING', s2:'When clicked you will securely erase your wallet data from this device. NOTICE this is irreversible operation, you may loose your coins.', a:'Unbind'})
    } 
    setOptions(optionsBuilder)
    // refreshTransactions();
    // const interval = setInterval(refreshTransactions,40000);
    // return () => clearInterval(interval);
  },[])

  const handleClick = (item:ListItemData) =>{    
    if(item.id=='unbind'){
      unbindCTA();
    }
    if(item.id=='address_export'){
      exportAddress();
    }
    // if(item.id=='address_hodl'){
    //   return loadWalletWIF()
    //   .then((wif:any)=>{
    //     console.log('Here');
    //     navigation.navigate('Store',{screen: 'TabOneScreen', params: {wif: wif.p}})
    //   })
    // }
  }
  


  

  return (
    <View style={styles.container}>
      {isBusy?
      <ActivityIndicator size="large"/>
      :<>
      <Text style={{paddingVertical: 20}} h3>Wallet Actions</Text>
      <List data={options} theme="menuLike" onPress={handleClick}></List>
      {/* <ScrollView  scrollsToTop={true} showsVerticalScrollIndicator={false}>      
      
      <Text style={styles.inputLabel}>Local app data</Text>      
      <View style={styles.centered}>
        <Button style={styles.cta} capitalize onPress={mainCTA}>Clear</Button>
      </View>
      
      </ScrollView> */}
      </>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
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
