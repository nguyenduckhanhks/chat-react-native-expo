import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import { icons, SIZES, COLORS, FONTS } from '../../constants';

const Header = ({navigation, uidLogin, memberData, chatData, subtitle, titleColor, subtitleColor, onTapRightIcon}) => {
    const [rightAvatar, setRightAvatar] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        getChatAvatar()
        getChatName()
    },[chatData, memberData, uidLogin])

    const getChatAvatar = () => {
        if(!chatData || !memberData || !uidLogin) return;
        if(chatData['photo'] != '') return setRightAvatar(chatData['photo'])

        if(memberData.length == 1) 
            return setRightAvatar(memberData[0]['photo'])

        memberData.forEach(element => {
            if(element['id'] != uidLogin) return setRightAvatar(element['photo'])
        });
    }

    const getChatName = () => {
        if(!chatData || !memberData || !uidLogin) return;
        if(chatData['name'] != '') return setName(chatData['name'])

        if(memberData.length == 1) 
            return setName(memberData[0]['name'])

        memberData.forEach(element => {
            if(element['id'] != uidLogin) return setName(element['name'])
        });
    }

    return (
        <View style={{ flexDirection: 'row', height: 50, marginTop: 10 }}>
            <TouchableOpacity
                style={{
                    width: 30,
                    paddingLeft: 0,
                    justifyContent: 'center'
                }}
                onPress={() => navigation.pop()}
            >
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View
                    style={{
                        width: '70%',
                        height: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: SIZES.radius
                    }}
                >
                    <Text style={{ ...FONTS.h3, color: titleColor }}>{name}</Text>
                    <Text style={{ ...FONTS.body5, color: subtitleColor }}>{subtitle}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 30,
                    paddingRight: 0,
                    justifyContent: 'center'
                }}
                onPress={() => onTapRightIcon()}
            >
                <Image 
                    source={ rightAvatar ? {uri: rightAvatar} : icons.avatar} 
                    style={styles.avatar}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    avatar:{
        width:40,
        height:40,
        borderRadius:20,
    }
})