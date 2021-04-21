import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useEffect} from 'react';
import { AppState, ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';

import { RootStackParamList, MainStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import Onboarding from '../screens/Onboarding/Onboarding'
import {AppManager} from '../logic/AppManager'
import { useNavigation } from '@react-navigation/native';
import UnlockPin from '../screens/UnlockPin'


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createStackNavigator<RootStackParamList>();


function RootNavigator(sth:any) {
  // 0 - first run, onboarding shall be presented
  // 1 - locked, unlock screen shall be presented
  // 2 - operational
  const [authState, setAuthState] = React.useState<number>(0);

  let currentState:string;
  let previousState:string;

  const onboardingCompleted = () => {
    setAuthState(2);
  }

  const onForeground = () => {   
    if(authState!=0){
      setAuthState(1) // request user pin unless the user in in the onboarding process
    }
    if(authState==0){
      // check if the user has completed onboarding previously
      AppManager.loadPin().then((pin:string|null)=>{
        if(pin) {
          setAuthState(1) // when onboarding was completed then check pin
        }
      })
    }   
  };

  const handleAppStateChange = (nextAppState:string) => {     
    previousState = currentState;
    currentState = nextAppState;    
  
    // console.log('New state ', currentState, previousState);
    if(currentState && previousState && currentState == 'active' && previousState.match(/inactive|background/))
      onForeground();
  };
  
  // register listener for cases when app is returned from background
  useEffect(()=>{        
    AppState.addEventListener('change', handleAppStateChange);      
    onForeground(); 
  },[])

  // prevent "You can pass the function as children to 'Screen' instead to achieve the desired behaviour"
  const OnboardingWrapper = (props:any) => (
    <Onboarding onOnboardingCompleted={onboardingCompleted} {...props}></Onboarding>    
  );
  const UnlockPinWrapper = (props:any) => (
    <UnlockPin onUnlockSuccess={()=>{setAuthState(2)}} {...props}></UnlockPin>    
  );

  return (
    <RootStack.Navigator mode='modal' screenOptions={{ headerShown: false}} initialRouteName={'Onboarding'}>      
      {authState==0?<RootStack.Screen name="Onboarding" component={OnboardingWrapper} />:null}
      {authState==2?<RootStack.Screen name="Root" component={MainNavigator} />:null} 
      {authState==1?<RootStack.Screen name="Unlock" component={UnlockPinWrapper} />:null}
    </RootStack.Navigator>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const MainStack = createStackNavigator<MainStackParamList>();

function MainNavigator() {
  // const navigation = useNavigation();
  // const [locked, setLocked] = React.useState<boolean>(false);
  // let currentState:string;
  // let previousState:string;
  

  // const onForeground = () => {   
    
    
  //   AppManager.loadPin().then((pin:string|null)=>{
  //     if(pin)
  //       navigation.navigate('Unlock');
  //   })
  // };

  // const handleAppStateChange = (nextAppState:string) => {     
  //   previousState = currentState;
  //   currentState = nextAppState;    
  
  //   // console.log('New state ', currentState, previousState);
  //   if(currentState && previousState && currentState == 'active' && previousState.match(/inactive|background/))
  //     onForeground();
  // };
  

  // useEffect(()=>{        
  //   AppState.addEventListener('change', handleAppStateChange);  
    
  //   onForeground(); 
  // },[])


  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>      
      <MainStack.Screen name="Main" component={BottomTabNavigator}/>
      <MainStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />      
    </MainStack.Navigator>
  );
}
