import React from 'react';
// import { StyleSheet} from 'react-native';

import { Text, View, Image} from 'react-native';

interface Props {
  title: string,
  description: string,
  asset: string,
  src?: string,
  bgColor?: string,
  descColor?:string,
  width: number,
  height: number
}
const ImageTitled = (props: Props) => {
  const {bgColor, src, asset, width, height, descColor, description, title} = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , paddingVertical:20}}>
        <View style={{ backgroundColor: bgColor?bgColor:"#eee", borderRadius: 10, overflow: "hidden" }}>
          <View>
            <Image
              source={require("../assets/images/vault.png")}
              style={{
                height: height,
                width: width
              }}
            />
          </View>
          <View style={{ padding: 10, width: width }}>
            <Text>{title}</Text>
            <Text style={{ color: descColor?descColor:"#777", paddingTop: 5 }}>
              {description}
            </Text>
          </View>
        </View>
      </View>
  )
  
}

export const ImageTitledUnbox = (props: Props) => {
  const {bgColor, src, asset, width, height, descColor, description, title} = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" , paddingVertical:20}}>
        <View style={{ backgroundColor: bgColor?bgColor:"#eee", borderRadius: 10, overflow: "hidden" }}>
          <View>
            <Image
              source={require("../assets/images/vault-unbox.png")}
              style={{
                height: height,
                width: width
              }}
            />
          </View>
          <View style={{ padding: 10, width: width }}>
            <Text>{title}</Text>
            <Text style={{ color: descColor?descColor:"#777", paddingTop: 5 }}>
              {description}
            </Text>
          </View>
        </View>
      </View>
  )
  
}

// const styles = StyleSheet.create({
//   desc: {
//     padding:
//     backgroundColor: '#fff',
//   }
// })

export default ImageTitled;