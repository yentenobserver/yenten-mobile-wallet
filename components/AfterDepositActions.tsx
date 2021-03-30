import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import {Button} from 'galio-framework'
import {Integrations} from '../logic/IntegrationManager'
import {Settings} from '../logic/Settings'
import moment from 'moment'
import {AppManager} from '../logic/AppManager'
import { useNavigation } from '@react-navigation/native';

interface Props {
  passport: string,
  email: string,
  maturity: number,
  priceFormatted: string,
  price: number
}
export default function AfterDepositActions(props:Props) {
  const {passport, email, maturity, priceFormatted, price} = props;
  const navigation = useNavigation();

  const mainCTA = () => {
    // console.log(priceFormatted, price, price/10e8);
    const paymentURL = `yenten:YgKbeZrDbGy75nHYwtBeW8ngSLbPJdLUmn?label=yVault&message=${email}&amount=${price/10e8}`
    // console.log(paymentURL);
    openURL(paymentURL)
  };

  const secondaryCTA = () =>{
    navigation.navigate('Passports', {screen: 'ListScreen'})
  }

  function openURL(url:string) {
    WebBrowser.openBrowserAsync(
      url
    );
  }

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Your WIF Yenten Private Key was successfully processed and secured as the Passport:
        </Text>
        
        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">          
          <MonoText selectable={true}>
          {passport}
          </MonoText>
        </View> 
        <Text
          selectable={true}
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Generator audit: 
        </Text>        
        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">          
          </Text>
          <MonoText>
            Generating yVault ...
          </MonoText>
          <MonoText>
            Using params:
          </MonoText>          
          <MonoText>
          &nbsp;&nbsp;unlockEmail: {email}
          </MonoText>
          <MonoText>
          &nbsp;&nbsp;maturesIn: {AppManager.maturityRemaining(AppManager.maturityToTimestamp(Date.now(), maturity))}
          </MonoText>
          <MonoText>
          &nbsp;&nbsp;pendingFeeAmount: YTN {priceFormatted}
          </MonoText>
          <MonoText>
            1. Key Controll Share (1/3) Stored on Vault Server ... DONE.
          </MonoText>
          <MonoText>
            2. Key Unlock Share (2/3) Stored on Vault Server ... DONE.
          </MonoText>
          <MonoText>
            3. Key Passport (3/3) Stored ONLY on device ... DONE.
          </MonoText>
          <MonoText>
            4. Confidentiality check... 2/3 shares detected on yVault server ... OK.
          </MonoText>
          <MonoText>
            Generating yVault ... DONE.
          </MonoText>
        </View>
        <Text
          style={styles.priceText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Pending payment: YTN {price/10e8} 
        </Text>        
        <View style={styles.centered}>
          <Button style={styles.cta} capitalize onPress={mainCTA}>{`Proceed to Payment (YTN ${priceFormatted})`}</Button>
        </View>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          NOTICE - Please do remember that without payment the Vault will not get matured and as a result the Private Key will be unrecoverable from the Vault.
        </Text>        
        
        {/* <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">          
          Neither Trustee nor vault server can decode the Private Key as each party does not have all necessary key shares (3/3). The Trustee will eventually gain access to the Private Key 
          when the share matures.
        </Text>               */}
      </View>
      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={secondaryCTA} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            I'll pay later. Take me to my newly secured passport.
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Give me a Yenten Tip if you find this application usefull.
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}



const styles = StyleSheet.create({
  cta: {
    width: '100%',
    backgroundColor: '#002244',
    shadowColor:'#899e8b',
    marginVertical: 20    
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    marginVertical: 10,
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
    
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    // textAlign: 'center',
  },
  priceText: {
    marginVertical: 20,
    fontSize: 28,
    // lineHeight: 24,
    textAlign: 'center',
  },
  getStartedText2: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
