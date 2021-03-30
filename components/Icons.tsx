
import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
// export function IconsIon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
//     return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
//   }
  export function IconsIon(props: { name: any; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  
  // export function IconsMaterial(props: { name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string }) {
  //   return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
  // }
  export function IconsMaterial(props: { name: any; color: string }) {
    return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  
  export function IconsFA(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
    return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />;
  }