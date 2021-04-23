import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text } from 'galio-framework';
// import { Text, View } from '../components/Themed';
import { View } from './Themed';

import { useFocusEffect } from '@react-navigation/native';

import { Overlay } from 'react-native-elements';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { ButtonCentered } from './Controlls';
import { YentenAPI } from '../logic/CoinManager';

interface Props {
    scan:boolean;
    onCancel:any;
    onScanned:any
}

export default function QRAddressScanner(props: Props) {
    const {scan, onCancel, onScanned} = props; // controlls showing the camera overlay, also triggers permission request/check

    const [requestPermission, setRequestPermission] = React.useState<boolean>(false); // triggers camera permission prompt

    const [hasPermission, setHasPermission] = React.useState<boolean>(false);   // current state of camera permission
    const [scanned, setScanned] = React.useState<boolean>(false);

    // permission checking
    useEffect(() => {        
        if(requestPermission){                        
            (async () => {                
                const { status } = await BarCodeScanner.requestPermissionsAsync();                
                setHasPermission(status === 'granted');
            })();            
        }
        
    }, [requestPermission]);

    // check permission when overlay is showed
    useEffect(() => {
        setRequestPermission(true);                        
    }, [scan]);

    //@ts-ignore
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);        
        const address = YentenAPI.extractAddressFromURL(data);        
        onScanned(address);
        setScanned(false); 
    };

    const handleCancel = () => {
        setScanned(false);   
        if(onCancel)
            onCancel()     
    };


    return (
        <Overlay isVisible={scan} onBackdropPress={handleCancel}>
            <View style={styles.container}>
            {hasPermission?<>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />                
            </>
            :<>
            <Text h3>Permission required</Text> 
            <Text>Camera access is required for scanning recipient address from QR Code</Text> 
            <ButtonCentered label="Grant camera access" onPress={() => setRequestPermission(true)}></ButtonCentered>
            <Text>If grant popup does not appear after pressing the button please check you device camera permission settings manually</Text> 
            </>}
                
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        minWidth: '65%',
        maxHeight: 300
        
    },
    // scrollIn: {
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cta: {
        width: '100%',
        backgroundColor: '#002244',
        shadowColor: '#899e8b',
        marginVertical: 20
    },
    ctaDisabled: {
        width: '100%',
        backgroundColor: '#B3B3B3',
        shadowColor: '#939393',
        marginVertical: 20,
    },
    maturity: {
        width: '100%'
    },
    // title: {
    //   fontSize: 20,
    //   fontWeight: 'bold',
    // },
    pass: {
        fontSize: 20,
        width: '100%',
    },
    inputLabelWrapper: {
        flex: 1,
        alignContent: 'center'
    },
    inputLabel: {
        fontWeight: '500',
        // marginVertical: 8,
        marginTop: 8,
        marginBottom: 0,
        paddingHorizontal: 16,
        textAlign: 'left',
        width: '100%'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
