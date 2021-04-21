import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import DepositScreen from '../screens/DepositSuccess'
import { BottomTabParamList, TabOneParamList, TabTwoParamList, DevToolsParamList, PassportsParamList, WalletParamList } from '../types';
import DepositSuccess from '../screens/DepositSuccess';
import UnlockSuccess from '../screens/UnlockSuccess';
import {Settings} from '../logic/Settings'
import DevTools from '../screens/Dev/DevTools';
import Passports from '../screens/Passports';
import WalletScreen from '../screens/Wallet/WalletScreen';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Wallet"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint}}>
      <BottomTab.Screen
        name="Wallet"
        component={WalletNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="wallet-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Store"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon2 name="archive" color={color} />,
        }}
      />
      {/* <BottomTab.Screen
        name="Unlock"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon3 name="box-open" color={color} />,
        }}
      /> */}
      <BottomTab.Screen
        name="Passports"
        component={PassportsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="keypad-outline" color={color} />,
        }}
      />
      
      {Settings.developmentMode?
      <BottomTab.Screen
      name="Dev"        
      component={DevToolsNavigator}
      options={{
        tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
      }}
    />
      :null}
      
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIcon2(props: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string }) {
  return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIcon3(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}        
        options={{ headerTitle: 'Store in yVault', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}  
              
      />
      <TabOneStack.Screen name="DepositSuccess" component={DepositSuccess} options={{ title: 'Deposit' }} />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator >
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Unlock yVault', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}        
      />
      <TabTwoStack.Screen name="UnlockSuccess" component={UnlockSuccess} options={{ title: 'Unlock Success!' }} />
    </TabTwoStack.Navigator>
  );
}

const PassportsStack = createStackNavigator<PassportsParamList>();

function PassportsNavigator() {
  return (
    <PassportsStack.Navigator>
      <PassportsStack.Screen
        name="ListScreen"
        component={Passports}
        options={{ headerTitle: 'Manage passports', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}
      />     
      <PassportsStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Unlock yVault', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}
      />
      <PassportsStack.Screen name="UnlockSuccess" component={UnlockSuccess} options={{ title: 'Unlock Success!' }} /> 
    </PassportsStack.Navigator>
  );
}

const DevToolsStack = createStackNavigator<DevToolsParamList>();

function DevToolsNavigator() {
  return (
    <DevToolsStack.Navigator>
      <DevToolsStack.Screen
        name="DevToolsScreen"
        component={DevTools}
        options={{ headerTitle: 'Tools' }}
      />      
    </DevToolsStack.Navigator>
  );
}

const WalletStack = createStackNavigator<WalletParamList>();

function WalletNavigator() {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{ headerTitle: 'Private Wallet', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}
      />  
      <WalletStack.Screen
        name="MenuScreen"
        component={DevTools}
        options={{ headerTitle: 'Settings', headerStyle: {
          backgroundColor: Colors.light.yellowSea,
        } }}
      />     
    </WalletStack.Navigator>
  );
}

// const WalletMenuDrawer = createDrawerNavigator();
// function WalletMenuDrawerNavigator() {
//   return (
//     <WalletMenuDrawer.Navigator>
//       <WalletMenuDrawer.Screen
//         name="WalletScreen"
//         component={WalletScreen}
//         options={{ headerTitle: 'Private Wallet', headerStyle: {
//           backgroundColor: Colors.light.yellowSea,
//         } }}
//       />      
//     </WalletMenuDrawer.Navigator>
//   );
// }


