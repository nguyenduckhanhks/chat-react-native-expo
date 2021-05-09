import React from 'react';
import {View,Text,StyleSheet,Image} from 'react-native';
import { icons, COLORS } from '../../constants';

const Received = ({image, message}) => {
    return(
        <View style={styles.container}>
          <Image source={icons.avatar} style={styles.img}/>
          <View>
                <View 
                    style={{
                        backgroundColor: COLORS.gray,
                        borderBottomLeftRadius:25,
                        borderBottomRightRadius:25,
                        borderTopRightRadius:25,
                        paddingVertical: 5
                    }}
                >
                   <Text style={styles.message}>{message}</Text>
                </View>
               <Text style={styles.duration}>12:13 AM</Text>
          </View>
        </View>
    )
}
export default Received;
const styles = StyleSheet.create({
    duration:{
        color:'#b6b6b6',
        fontSize:11,
        marginHorizontal:15,
        marginTop:5,
    },
    container:{
        flexDirection:'row',
        marginTop:20,
        width:250,
    },
    img:{
        width:40,
        height:40,
        borderRadius:20
    },
    message:{
        fontSize:13,
        marginHorizontal:15,
        backgroundColor: COLORS.gray,
        paddingHorizontal:10,
        paddingVertical:10,
    }
})