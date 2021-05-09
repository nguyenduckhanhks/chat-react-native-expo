import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { COLORS, FONTS } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../components/Disscusion/Header';
import ChatPanel from '../components/Disscusion/ChatPanel';

const Disscusion = () => {
    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.primary2, COLORS.primary1, COLORS.primary]}
        >
            <View style={{paddingHorizontal: 20}}>
                <Header/>
            </View>

            <View style={styles.chatPanel}>
                <View style={{paddingHorizontal: 10,}}>
                    <ChatPanel
                        // itemPic={chatPhoto}
                        // dataMessage={listMessage}
                        // uid={uid}
                    />
                </View>
                <View style={styles.inputSection}>
                    <View style={styles.messageInput}>
                        <Icon style={styles.inputIcon} name="chatbox-outline" size={20} color={COLORS.primary}/>
                        <TextInput
                            style={{...FONTS.body3, width: '100%', paddingLeft: 10}}
                            placeholder="Tin nhắn"
                        />
                        <TouchableOpacity 
                            style={{right: 20, position: 'absolute'}} 
                            onPress={() => {}}
                        >
                            <Icon style={{}} name="send-outline" size={25} color={COLORS.primary}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

export default Disscusion

const styles = StyleSheet.create({
    container: {
        height:'98%',
        position:"absolute",
        left:0,
        right:0,
        top:0,
        paddingTop:30
    },
    chatPanel: {
        paddingTop: 20,
        backgroundColor: COLORS.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        marginTop: 10,
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal:10,
        paddingBottom: 20,
        backgroundColor: COLORS.gray,
        // marginTop: 5,
        height: 60,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: '100%'
    },
    messageInput: {
        backgroundColor: COLORS.white, 
        width: '110%', 
        marginLeft: '-5%', 
        paddingHorizontal:'5%', 
        paddingVertical: 10, 
        height: 50, 
        flexDirection: 'row',
        alignItems: 'center',
    }
})