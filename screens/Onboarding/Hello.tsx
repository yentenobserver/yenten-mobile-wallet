import React from 'react';
import { View, Text, Image } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';


interface Props {
  backgroundColor: string
  iconName: any
  title: string,
  stepId: string,
  onStepComplete?:any
}
const Hello = (props: Props) => {
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])      
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.backgroundColor
      }}
    >
      {/* <Icon name={props.iconName} size={172} color="white" /> */}
      <Image
              source={require("../../assets/images/mine-logo.png")}
              style={{
                height: 200,
                width: 200
              }}
            />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {props.title}
        </Text>
        <Text style={{ fontSize: 24, color: 'white' }}>
          Swipe to begin configuration
        </Text>
      </View>
    </View>
  );
}

export default Hello