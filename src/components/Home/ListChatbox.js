import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {FONTS, COLORS, icons } from '../../constants'

const randomTime = () => {
    const hrs = Math.round(Math.random()*12);
    const mins = Math.round(Math.random()*60);
    const hFormat = hrs < 10 ? '0' : '';
    const mFormat = mins < 10 ? '0' : '';
    const amPm = hrs < 12 ? 'AM' : 'PM';
    return String(hFormat + hrs + ":"+ mFormat + mins + " " + amPm)
}

const ListChatbox = ({ chatName, avatar, count, onPress, lastMessage, lastTime }) => {
    return(
       <TouchableOpacity 
        onPress={onPress}
        style={styles.chatbox}
       >       
            <Image source={avatar ? { uri: avatar} : icons.avatar} style={styles.avatar}/>
            <View style={{marginLeft:10}}>
                <Text style={styles.chatName}>{chatName}</Text>
                <Text style={styles.lastMessage}>{lastMessage}</Text>
            </View>
            <View style={{position: 'absolute', right: 20}}>
                <Text style={styles.lastTime}>{lastTime}</Text>
                {
                count > 0 ? (
                    <LinearGradient
                        colors={['#f26a50', '#f20045', '#f20045']}
                        style={styles.countMsg}
                    >
                        <Text style={styles.count}>{count}</Text>
                    </LinearGradient>
                ):
                    null
                }
            </View>
       </TouchableOpacity>
    )
}
export default ListChatbox;

const styles = StyleSheet.create({
    chatbox:{
        flexDirection:'row',
        paddingHorizontal:20,
        alignItems:'center',
        marginTop:30
    },
    countMsg:{
       height:20,
       width:20,
       borderRadius:10,
       alignItems:'center',
       justifyContent:'center',
       marginLeft: 150
    },
    count:{
        color:COLORS.white,
    },
    avatar:{
        width:60,
        height:60,
        borderRadius:30
    },
    lastMessage:{
        color: COLORS.darkgray,
        fontSize:11
    },
    lastTime:{
        color:COLORS.black,
        fontSize:12,
        marginLeft:150,
    },
    chatName:{
        ...FONTS.body3,
        color: COLORS.black,
    }
})
