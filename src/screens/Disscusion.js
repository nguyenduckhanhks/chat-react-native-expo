import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { COLORS, FONTS, icons } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Header from '../components/Disscusion/Header';
import ChatPanel from '../components/Disscusion/ChatPanel';

const TYPE_ACCOUNT = 'account'
const TYPE_GROUP = 'group'
const windowHeight = Dimensions.get('window').height;

const Disscusion = ({navigation, route}) => {
    const [uidLogin, setUidLogin] = useState('')
    const [chatId, setChatId] = useState('')
    const [chatData, setChatData] = useState(null)
    const [messages, setMessages] = useState([])
    const [messageValue, setMessageValue] = useState('')
    const [memberData, setMemberData] = useState([])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getChat()
    },[uidLogin])

    useEffect(() => {
        getMessage()
    }, [chatId])

    useEffect(() => {
        getMemberData()
    }, [chatData])

    const equals = (a, b) => {
        if(!a || !b) return false
        if(a.length != b.length) return false
        
        for (var i = 0, l=a.length; i < l; i++) {
            // Check if we have nested arrays
            if (a[i] instanceof Array && b[i] instanceof Array) {
                // recurse into the nested arrays
                if (!a[i].equals(b[i]))
                    return false;       
            }           
            else if (a[i] != b[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
    }

    const getChat = () => {
        if(!uidLogin) return;
        if(route.params.type == TYPE_ACCOUNT) {
            firebase.firestore()
                    .collection('chats')
                    .where('members', 'array-contains-any', [route.params.userId, uidLogin])
                    .where('type', '==', TYPE_ACCOUNT)
                    .onSnapshot(querySnapshot => {
                        if(querySnapshot.docs.length > 0) {
                            let isnew = false
                            querySnapshot.docs.forEach(doc => {
                                let members = doc.data()['members']
                                if(equals(members, [route.params.userId, uidLogin])) {
                                    isnew = true
                                    setChatId(doc.id)
                                    setChatData({
                                        id: doc.id,
                                        ...doc.data()
                                    })
                                }
                            })

                            if(!isnew) createChat(route.params.userId) 
                            else
                            getMessage()
                        }else {
                            createChat(route.params.userId)
                        }
                    })
        }

        if(route.params.type == TYPE_GROUP) {
            firebase.firestore()
                    .collection('chats')
                    .doc(route.params.idChat)
                    .onSnapshot(doc => {
                        setChatId(doc.id)
                        setChatData({
                            id: doc.id,
                            ...doc.data()
                        })
                        getMessage()
                    })
        }
    }

    const getMessage = () => {
        if(!chatId) return
        console.log(chatId)
        firebase.firestore()
                .collection('messages')
                .where('idChat', '==', chatId)
                .orderBy('created')
                .onSnapshot(querySnapshot => {
                    let messages = querySnapshot.docs.map(msg => {
                        return {
                            id: msg.id,
                            ...msg.data()
                        }
                    });
                    setMessages(messages)
                })
    }

    const sendMessage = () => {
        let newMessage = {
            content: messageValue,
            idChat: chatId,
            owner: uidLogin,
            created: Date.now()
        }
        firebase.firestore()
                .collection('messages')
                .add(newMessage)
                .then(res => {
                    setMessageValue('')
                    getMessage()
                })

    }

    const createChat = (uid) => {
        if(!uid || !uidLogin) return;
        let newChat = {
            name: '',
            admin: '',
            photo: '',
            members: [uid, uidLogin],
            type: TYPE_ACCOUNT
        }
        firebase.firestore()
                .collection('chats')
                .add(newChat)
                .then(res => {
                    updateIdChat(res.id)
                    setChatId(res.id)
                    setChatData({
                        id: res.id,
                        ...newChat
                    })
                })
    }

    const updateIdChat = (id) => {
        firebase.firestore()
                .collection('chats')
                .doc(id)
                .update({
                    id: id
                })
    }

    const getMemberData = () => {
        if(!chatData) return;
        firebase.firestore()
                .collection('users')
                .where('id', 'in', chatData['members'])
                .onSnapshot(querySnapshot => {
                    let list = querySnapshot.docs.map(doc => {
                        return {
                            ...doc.data()
                        }
                    })
                    setMemberData(list)
                })
    }

    const onCLickIconHeader = () => {
        if(route.params.type == TYPE_ACCOUNT){
            if(route.params.userId != uidLogin) {
                navigation.navigate('Profile',{
                    userId: route.params.userId,
                    type: 'account'
                })
            } else {
                navigation.navigate('Profile', {
                    type: 'myProfile'
                })
            }
        }

        if(route.params.type == TYPE_GROUP){
            navigation.navigate('ChatboxSetting', {
                chatData: chatData,
                memberData: memberData
            })
        }
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.primary2, COLORS.primary1, COLORS.primary]}
        >
            <View style={{paddingHorizontal: 20}}>
                <Header 
                    navigation = {navigation}
                    uidLogin={uidLogin}
                    chatData={chatData}
                    memberData={memberData}
                    onTapRightIcon={onCLickIconHeader}
                    subtitle="Đang hoạt động"
                />
            </View>

            <KeyboardAwareScrollView style={styles.chatPanel}>
                <View style={{height: windowHeight * 0.86}}>
                    <View style={{paddingHorizontal: 10,}}>
                        <ChatPanel
                            dataMessage={messages}
                            uidLogin={uidLogin}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <View style={styles.messageInput}>
                            <Icon style={styles.inputIcon} name="chatbox-outline" size={20} color={COLORS.primary}/>
                            <TextInput
                                style={{...FONTS.body3, width: '100%', paddingLeft: 10}}
                                placeholder="Tin nhắn"
                                value={messageValue}
                                onChangeText={setMessageValue}
                            />
                            <TouchableOpacity 
                                style={{right: 20, position: 'absolute'}} 
                                onPress={() => sendMessage()}
                            >
                                <Icon style={{}} name="send-outline" size={25} color={COLORS.primary}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
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