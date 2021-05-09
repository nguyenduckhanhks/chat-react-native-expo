import React from 'react';
import {View,Text,StyleSheet,Image} from 'react-native';
import { FONTS, COLORS} from '../../constants'

const UserOnline = ({username, avatar}) => {
    return(
        <View style={styles.container}>
            <Image source={{uri: avatar}} style={styles.avatarStyle}/>
            <Text style={styles.nameStyle}>{username}</Text>
        </View>
    )
}
export default UserOnline;
const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        marginTop:20,
        marginRight:17
    },
    avatarStyle:{
        width:60,
        height:60,
        borderRadius:30
    },
    nameStyle:{
        ...FONTS.body4,
        marginTop:10,
        color: COLORS.black
    }
})