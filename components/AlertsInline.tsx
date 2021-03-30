import React from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { StyleSheet} from 'react-native';
import Colors from '../constants/Colors';

interface Props {
    title?:string,
    msg?: string,
    type?:"info"|"warning",
    children?:any
}
export const AlertInline = (props: Props) => {
    const {type, msg, title, children} = props;

  return (
      <>
      {title?<Text h3 style={[type=='info'?styles.info:styles.warning, styles.emp]}>{title}</Text>:null}
      <Text style={type=='info'?styles.info:styles.warning}>{msg}</Text>
      {children}
      </>
    // <View style={[styles.centered,type=='info'?{backgroundColor: "blue"}:{backgroundColor: "yellow"}]}>
    //     <View style={styles.title}>
    //         <Text h3>{title}</Text>
    //     </View>
    //     <View style={styles.msg}>
    //         <Text>{msg}</Text>
    //     </View>
        
        
    // </View>
  )  
}

export const AlertInlineSuccess = (props: Props) => {
  const {msg, title, children} = props;

return (
    <>
    {title?<Text h3 style={[styles.info, styles.emp]}>{title}</Text>:null}
    <Text style={styles.info}>{msg}</Text>
    {children}
    </>  
)  
}


const styles = StyleSheet.create({
    emp: {
        fontWeight: '800'
    },
    info:{
        color: Colors.dark.v2.darkGreen,
        fontSize: 16
    },
    warning:{
        color: Colors.dark.v2.red,
        fontSize: 16
    },
    centered: {
        flex:1,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 5,
        
      },    
      title:{
        
        flex:1,
        backgroundColor: 'transparent'
      },
      msg:{
        paddingVertical: 5,
        flex:1,
        backgroundColor: 'transparent',
        flexDirection:'column',
        alignItems: 'flex-start',
      }   
})
