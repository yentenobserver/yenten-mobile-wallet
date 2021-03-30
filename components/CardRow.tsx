import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native'
import { Card } from 'react-native-elements';
import { Image } from 'react-native-elements';
import { Text } from 'galio-framework';

import colors from '../constants/Colors'
// import { StyleSheet} from 'react-native';

const theme = {
  imageSize: 35,
  imageRadius: 30,
  height: 80,
  left: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  small:{
    left: {
      fontSize: 18,
      fontWeight: 'normal',
    },
    right: {
      fontSize: 18,
      fontWeight: 'normal',
    }  
  },
  right: {
    fontSize: 26,
    fontWeight: 'bold',
  }
  
  
  
}

interface Props {
  imageURL?:string,
  leftMsg?:string,
  rightMsg?:string,
  backgroundColor?:string,
  
}
const CardRow = (props: Props) => {
  // const {bgColor, src, asset, width, height, descColor, description, title} = props;
  const {backgroundColor, leftMsg, rightMsg, imageURL} = props;

  return (
    // <Card containerStyle={{...styles.card,bgColor?...{backgroundColor: bgColor}:null}}>
    <Card containerStyle={[styles.card,backgroundColor?{backgroundColor: backgroundColor}:null]}>
      <View style={styles.row}>
        <View style={styles.leftCol}>
          {imageURL?<Image style={styles.image} source={{ uri: imageURL }}></Image>:null} 
          
          <Text style={styles.leftText}>
            {leftMsg}
            </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.rightText}>
          {rightMsg}
          </Text>
        </View>
        
      </View>      
    </Card>
  )
}

interface DoubleProps {
  imageURL1?:string,
  leftMsg1?:string,
  rightMsg1?:string,
  imageURL2?:string,
  leftMsg2?:string,
  rightMsg2?:string,
  backgroundColor?:string
}
export const CardDoubleRow = (props: DoubleProps) => {
  // const {bgColor, src, asset, width, height, descColor, description, title} = props;
  const {backgroundColor, leftMsg1, rightMsg1, imageURL1, leftMsg2, rightMsg2, imageURL2} = props;

  return (
    // <Card containerStyle={{...styles.card,bgColor?...{backgroundColor: bgColor}:null}}>
    <Card containerStyle={[styles.card,backgroundColor?{backgroundColor: backgroundColor}:null]}>
      <View style={styles.row}>
        <View style={styles.leftCol}>
          {imageURL1?<Image style={styles.image} source={{ uri: imageURL1 }}></Image>:null}          
          <Text style={styles.leftTextSmall}>
            {leftMsg1}
            </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.rightTextSmall}>
          {rightMsg1}
          </Text>
        </View>
        
      </View> 
      <View style={styles.row}>
        <View style={styles.leftCol}>
          {imageURL2?<Image style={styles.image} source={{ uri: imageURL2 }}></Image>:null}          
          <Text style={styles.leftTextSmall}>
            {leftMsg2}
            </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.rightTextSmall}>
          {rightMsg2}
          </Text>
        </View>
        
      </View>     
    </Card>
  )
}

// export const ImageTitledUnbox = (props: Props) => {
//   const {bgColor, src, asset, width, height, descColor, description, title} = props;

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , paddingVertical:20}}>
//         <View style={{ backgroundColor: bgColor?bgColor:"#eee", borderRadius: 10, overflow: "hidden" }}>
//           <View>
//             <Image
//               source={require("../assets/images/vault-unbox.png")}
//               style={{
//                 height: height,
//                 width: width
//               }}
//             />
//           </View>
//           <View style={{ padding: 10, width: width }}>
//             <Text>{title}</Text>
//             <Text style={{ color: descColor?descColor:"#777", paddingTop: 5 }}>
//               {description}
//             </Text>
//           </View>
//         </View>
//       </View>
//   )

// }

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#ffffff',
    backgroundColor: colors.light.yellowSea,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin:0,
    minHeight: theme.height,
    marginVertical: 20,
    width: '100%',
    maxHeight: 80
    // shadowColor: '#ff2222'
    // padding: 0
  },
  image: {
    flex: 1, 
    width: theme.imageSize, 
    height: theme.imageSize, 
    borderRadius: theme.imageRadius,
    marginRight: 10
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  leftCol: {
    flex: 1, 
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingVertical: 0,
    height: theme.imageSize
  },
  rightCol: {
    flex: 1, 
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',        
    height: theme.imageSize
  },
  leftText: {
    flex:1,
    color:"#111111",
    fontWeight: theme.left.fontWeight.toLowerCase()=='bold'?"bold":"normal",
    fontSize: theme.left.fontSize
  },
  rightText: {

    color:"#111111",    
    fontSize: theme.right.fontSize,    
    fontWeight: theme.right.fontWeight.toLowerCase()=='bold'?"bold":"normal"
    
  },
  leftTextSmall: {
    flex:1,
    color:"#111111",
    fontWeight: theme.small.left.fontWeight.toLowerCase()=='bold'?"bold":"normal",
    fontSize: theme.small.left.fontSize
  },
  rightTextSmall: {

    color:"#111111",    
    fontSize: theme.small.right.fontSize,    
    fontWeight: theme.small.right.fontWeight.toLowerCase()=='bold'?"bold":"normal"
    
  }
})

export default CardRow;
