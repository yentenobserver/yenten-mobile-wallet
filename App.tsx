// // random bytes workaround
// import webCrypto,{ polyfillWebCrypto} from 'expo-standard-web-crypto';
// polyfillWebCrypto();
// // random bytes workaround end

// import crypto from 'expo-standard-web-crypto';


// console.log('Wind', window.crypto.getRandomValues, global.crypto.getRandomValues);

import './shim'

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [locked, setLocked] = useState<boolean>(false);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>        
        <Navigation colorScheme={colorScheme} />                
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
