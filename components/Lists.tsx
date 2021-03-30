import React, { useEffect, useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { Input } from 'galio-framework';
import { StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';
import {Button} from 'galio-framework'
import { View } from './Themed';

import TextInput from './TextInput';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { IconsIon, IconsMaterial } from './Icons';


export interface ListItemData{
  id: string,
  s1?: string,  // first line
  s2?: string,  // second line
  a?:string,  //action line
  i1?: {  // icon 1
    n: string,  // name
    c: string // color
  }
  
}
interface ListProps {
  data:ListItemData[],
  theme: "menuLike",
  emptyMsg?: string,
  onLongPress?:Function,
  onPress?:Function
}
export const List = (props: ListProps) => {
  const {data, onLongPress, onPress, emptyMsg, theme} = props;

return (
  <FlatList
        style={listStyles.list}
        data={data}
        renderItem={({ item }) => 
          (<>
          {theme=='menuLike'?<MenuLikeItem item={item} onPress={onPress?onPress:null} onLongPress={onLongPress?onLongPress:null}/>:null}
          
            
          </>)          
        }
        keyExtractor={item => item.id}
        ListEmptyComponent={()=><EmptyListItem msg={emptyMsg?emptyMsg:'The list is empty'}></EmptyListItem>}
        />
)  
}

interface EmptyListItemProps {
  msg: string
}
function EmptyListItem(props: EmptyListItemProps){
  const {msg} = props
  return (
    <View style={listStyles.listItem}>
      <Text>{msg}</Text>
    </View>  
  )
}

interface ItemProps {
  item: ListItemData,
  onPress?: any,
  onLongPress?: any
}

function MenuLikeItem(props:ItemProps) {
  const {item, onPress, onLongPress} = props;

  const press = () => {    
    if(onPress)
      onPress(item)
  }

  const longPress = () => {
    if(onLongPress)
      onLongPress(item)
  }
  
  return (
    <View style={listStyles.listItem}>  
    {item.i1?  // show icon
      (<>
      {item.i1.n.startsWith('i:material-')?<IconsMaterial name={item.i1.n.replace('i:material-','')} color={item.i1.c}></IconsMaterial>:null}
      {item.i1.n.startsWith('i:ion-')?<IconsIon name={item.i1.n.replace('i:ion-','')} color={item.i1.c}></IconsIon>:null}
      </>)
    :
    null
    }            
      <View style={listStyles.listItemText}>
        {item.s1?<Text style={listStyles.listItemTextHighlight}>{item.s1}</Text>:null}             
        {item.s2?<Text>{item.s2}</Text>:null}     
      </View>
      {item.a?
      <TouchableOpacity style={{height:50,width:100, justifyContent:"center",alignItems:"center"}} onPress={press} onLongPress={longPress}>
        <Text style={listStyles.listItemAction}>{item.a}</Text>
      </TouchableOpacity>
      :
      null}
    </View>
  );
}

const listStyles = StyleSheet.create({
  
  list: {
    flex:1, 
    minWidth:'100%'
  },
  listItem:{
    marginVertical:5,
    padding:10,
    backgroundColor:"#ddd",
    width:"100%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  listItemText:{
    marginLeft: 18,
    alignItems:"flex-start",
    flex:1,
    backgroundColor:"#ddd",
  },
  listItemTextHighlight:
  {
    paddingVertical: 5,
    fontWeight:"bold",
    fontSize: 16
  },
  listItemAction: {
    fontWeight:"bold",
    color:'#006400',
  },
  listItemActionRed: {
    fontWeight:"bold",
    color:'red',
  }
})


const styles = StyleSheet.create({
    textExplainer: {
      textAlign: 'left', 
      width: '100%'
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      },
      cta: {
        width: '100%',
        backgroundColor: '#002244',
        shadowColor:'#899e8b',
        marginVertical: 20    
      },
      textarea: {    
        height: 60,
        margin: 2,
        borderWidth: 1, 
        borderRadius: 5,      
        paddingHorizontal: 10   
    },
    inputLabel: {
      fontWeight: '500',
      // marginVertical: 8,
      marginTop: 8,
      marginBottom: 0,
      paddingHorizontal: 16,
      textAlign: 'left',
      width: '100%'
    }
})
