import React from 'react';
import {View,Text,StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { COLORS} from '../../constants';

const Sent = ({message, create, setModal, time}) => {
    return(
        <View style={styles.container}>
            <LinearGradient
                colors={['#f26a50','#f20045']}
                style={styles.gradient}
            >
                <TouchableOpacity onPress={() => setModal(true)}>
                    <Text style={styles.text}>{message}</Text>
                </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.duration}>{time ? time : ''}</Text>
        </View>
    )
}
export default Sent;

const styles = StyleSheet.create({
    container:{
        marginVertical:25,
        alignSelf:'flex-end',
    },
    duration:{
        color:'#b6b6b6',
        fontSize:11,
        marginTop:5,
        alignSelf:'flex-end'
    },
    gradient:{
        maxWidth:220,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius: 20
    },
    text:{
        color:'#fff',
    }
})