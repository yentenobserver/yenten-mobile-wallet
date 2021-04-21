
import React, { useEffect, useState } from 'react';
// import { StyleSheet} from 'react-native';

import { Text } from 'galio-framework';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from './Themed';

import {YentenAPI} from '../logic/CoinManager'
import { FlatList } from 'react-native';
import { PendingOrder, WalletTransaction } from '../data/localStorage/Model';
import moment from 'moment'
import {IconsIon, IconsFA, IconsMaterial} from '../components/Icons'
import Colors from '../constants/Colors';
import { AppManager } from '../logic/AppManager';
import App from '../App';
import { Alert } from 'react-native';
import { SmallAmountFromString } from './AmountDisplay';


interface Props {
  address: string,
}
const TransactionsList = (props: Props) => {
  const {address} = props;


  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const mainCTA = (input:any)=>{
    // console.log(input);
  }

  const removePO = (input:any) => {
    // console.log(input);
    if(!input.oid){
      // only pending order can be removed
      return;
    }
        
    Alert.alert(
      `Remove Pending Order?`,
      `This is irrevocable operation. When removed the pending order ${input.oid} will be no longer displayed. Are you sure you wish to remove?`,
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, Remove!", onPress: () => AppManager.removePendingOrder(input.txid).then(()=>{
          refreshTransactions()
        })}
      ],
      { cancelable: true }
    );

  }

  const prepareTransactionList = async (orders:PendingOrder[], transactions:any[]):Promise<any[]>=>{
    // order go first, ordered by the creation date desc
    let result = [];

    // // remove those pending order that have already a transaction processed
    // let filteredOrders = orders.filter((item:PendingOrder)=>{
    //   // leave only orders that do not have matching transactions
    //   return transactions.findIndex((inItem:any)=>{return inItem.txid == item.txid}) == -1
    // })

    let filteredOrders:PendingOrder[] = []

    // remove those pending order that have already a transaction processed
    for(const order of orders){
      const transaction = await YentenAPI.getTransaction(order.txid);
      if(transaction.error){
        filteredOrders.push(order);
      }else{
        // console.log('Pending order was handled so going to remove', order.oid, order.txid)
        await AppManager.removePendingOrderByOid(order.oid)
      }
        
        
    }
    

    result = filteredOrders.sort((a:PendingOrder, b:PendingOrder)=>{return a.ct-b.ct});
    result.push(...transactions)
    return result;
  }

  const refreshTransactions = ()=>{
    // console.log('Refreshing');
    // AppManager.savePendingOrder(-Math.random()*10,'tx'+Math.random().toString(36).substring(2, 4),'oid'+Math.random().toString(36).substring(2, 4));
    let transactions:any[] = [];
    let orders:any[] = []
    YentenAPI.getTransactions(address)
    .then((response:any)=>{
        transactions = response.data.reverse();        
        return AppManager.loadPendingOrders();
    })
    .then(async (pendingOrders:PendingOrder[])=>{
        orders = pendingOrders;
        const finalList = await prepareTransactionList(orders, transactions)        
        setTransactions(finalList);        
    })    
  }

  useEffect(() => {
    refreshTransactions();
    const interval = setInterval(refreshTransactions,40000);
    return () => clearInterval(interval);
  },[])

  
  return (
    <>
    {/* <Text h3>Transactions</Text> */}
    <FlatList
        style={styles.list}
        data={transactions}
        renderItem={({ item }) => <Item item={item} onPress={mainCTA} onLongPress={removePO}/>}
        keyExtractor={item => item._id}
        ListEmptyComponent={()=><EmptyListItem></EmptyListItem>}
        />    
    </>    
  )
  
}


const styles = StyleSheet.create({
  
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

interface ItemProps {
    item: any,
    onPress?: any,
    onLongPress?: any
  }

function EmptyListItem(){
  return (
    <View style={styles.listItem}>
      <Text>Seems there are no transactions yet. Send or receive coins and transactions will show.</Text>
    </View>  
  )
}

function Item(props:ItemProps) {
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
      <View style={styles.listItem}>  
      {item.oid?  // pending order, present different icon
      <IconsMaterial name="credit-card-clock" color={Colors.dark.rustyNail}></IconsMaterial>
      :
      <IconsIon name={item.value>=0?"arrow-down-circle":"arrow-up-circle"} color={item.value>=0?"green":"red"}></IconsIon>
      }
              
        <View style={styles.listItemText}>
          <Text style={styles.listItemTextHighlight}>{moment.unix(item.time||item.ct/1000).format("MM/DD/YYYY")} {moment.unix(item.time||item.ct/1000).format("HH:mm:ss")}</Text>
          
          {/* <Text>Added: {new Date(item.created).toISOString().slice(0,10)}</Text> */}
          <Text>{item.oid?'Pending ':null}{item.value>=0?'Received':'Spent'}</Text>
          {/* <Text></Text> */}
        </View>
        <TouchableOpacity style={{height:50,width:100, justifyContent:"center",alignItems:"center"}} onPress={press} onLongPress={longPress}>
          {/* <Text style={item.value>=0?styles.listItemAction:styles.listItemActionRed}>{item.value>0?'+':''}{item.value.toFixed(8)}</Text> */}
          <SmallAmountFromString unit='sat' value={item.value.toFixed(8)} colorMark={true} ></SmallAmountFromString>
        </TouchableOpacity>
      </View>
    );
  }

export default TransactionsList;