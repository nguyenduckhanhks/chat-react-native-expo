import React from 'react';
import {View,Text,StyleSheet,Image, TouchableOpacity} from 'react-native';
import { FONTS, COLORS, icons} from '../../constants'

const UserOnline = ({navigation, username, avatar, uid}) => {
    return(
        <TouchableOpacity 
            style={styles.container}
            onPress={() => navigation.navigate('Profile', {
                type:'account',
                userId: uid
            })}
        >
            <Image source={avatar ? {uri: avatar} : icons.avatar} style={styles.avatarStyle}/>
            <Text style={styles.nameStyle}>{username}</Text>
        </TouchableOpacity>
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