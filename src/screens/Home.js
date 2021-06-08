import React, {useState, useRef, useEffect} from 'react';
import { 
    SafeAreaView, 
    StyleSheet, 
    ActivityIndicator, 
    Animated,
    ScrollView,
    View,
    Text,
    TextInput
} from 'react-native';
import { users } from '../data';
import { COLORS, FONTS, icons } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

import UserOnline from '../components/Home/UserOnline';
import ListChatbox from '../components/Home/ListChatbox';
import Header from '../components/Home/Header';

const Home = ({navigation}) => {
    const [uidLogin, setUidLogin] = useState('')
    const [listUser, setListUser] = useState([])
    const [chats, setChats] = useState({})
    const [chatsLastmessage, setChatsLastmessage] = useState({})
    const [chatsName, setChatsName] = useState({})
    const [chatIds, setChatIds] = useState([])
    const [chatMembers, setChatMembers] = useState([])
    const [mergeChat, setMergeChat] = useState([])

    const [loading, setLoading] = useState(true)
    const userOnlAnimate = useRef(new Animated.ValueXY()).current;
    const listChatAnimate = useRef(new Animated.ValueXY()).current;

    useEffect(() =>{
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })

        Animated.timing(userOnlAnimate, {
            toValue:{x:-400,y:0},
            delay:1000,
            useNativeDriver:false
        }).start();

        Animated.timing(listChatAnimate, {
            toValue:{x:0,y:-300},
            delay:2000,
            useNativeDriver:false
        }).start();

        getListUser()
        getChats()
    }, [uidLogin])

    useEffect(() => {
        getNameMessage()
    }, [ chatMembers])

    useEffect(() => {
        getLastMessage()
    }, [ chatIds])

    useEffect(() => {
        // console.log(chatMembers)
        if(!Object.keys(chatsName) || !Object.keys(chatsLastmessage) || Object.keys(chats) <= 0) return
        // console.log(Object.keys(chats).length)
        let mergeChat = {}
        Object.keys(chats).forEach(key => {
            let newChat = {
                admin: chats[key]['admin'],
                id: chats[key]['id'],
                members: chats[key]['members'],
                name: chatsName[key] ? chatsName[key]['name'] : '',
                photo: chatsName[key] ? chatsName[key]['photo'] : '',
                type: chats[key]['type'],
                count: chatsLastmessage[key] ? chatsLastmessage[key]['count'] : 1,
                lastMessage: chatsLastmessage[key] ? chatsLastmessage[key]['lastMessage'] : '',
                lastTime: chatsLastmessage[key] ? chatsLastmessage[key]['lastMessage'] : '',
                accountId: chats[key]['type'] == 'account' ? (chatsName[key] ? chatsName[key]['accountId'] : '') : ''
            }
            if(newChat['lastMessage'] !== '' || newChat['type'] === 'group') mergeChat[key] = newChat
        })
        setMergeChat(mergeChat)
    }, [ chatsName, chatsLastmessage])

    const getListUser = () => {
        firebase.firestore()
                .collection('users')
                .where('status', '==' , 'online')
                .onSnapshot(querySnapshot => {
                    const usersData = querySnapshot.docs.map(doc => {
                        const data = doc.data()
                        return {
                            uid: doc.id,
                            ...data
                        }
                    })
                    setListUser(usersData)
                    setLoading(false)
                })
    }

    const getChats = () => {
        setChatIds([])
        setChatMembers([])
        firebase.firestore()
                .collection('chats')
                .where('members', 'array-contains', uidLogin)
                .onSnapshot( querySnapshot => {
                    let chats = querySnapshot.docs.map( doc => {
                       return {
                            ...doc.data(),
                            id: doc.id
                        }
                    })
                    if(!chats) return;
                    let formatChats = {}
                    let chatIds = []
                    let chatMembers = []

                    chats.forEach(chat => {
                        formatChats[chat['id']] = chat
                        chatIds.push(chat['id'])
                        chatMembers = chatMembers.concat(chat['members'])
                    })
                    setChats(formatChats)
                    setChatIds(chatIds)
                    setChatMembers(chatMembers)
                }) 
    }

    const getLastMessage = () => {
        if(chats.length <= 0 || chatIds.length <= 0) return

        return firebase.firestore()
                .collection('messages')
                .where('idChat', 'in', chatIds)
                .onSnapshot(querySnapshot => {
                    let cChats = JSON.parse(JSON.stringify(chats))

                    const messageData = querySnapshot.docs.map(doc => {
                        return {
                            ...doc.data()
                        }
                    })

                    Object.keys(cChats).forEach(key => {
                        cChats[key]['count'] = 1
                        cChats[key]['lastMessage'] = ''
                        cChats[key]['lastTime'] = ''

                        let messages = messageData.filter(msg => msg['idChat'] == key).sort((a,b) => a['created'] > b['created'] ? -1 : 1)
                        if(messages.length > 0) {
                            cChats[key]['lastMessage'] = messages[0]['content']
                            cChats[key]['lastTime'] = messages[0]['created']
                        }
                    })
                    setChatsLastmessage(cChats)
                })
    }

    const getNameMessage = () => {
        if(chats.length <= 0 || chatMembers.length <= 0 || !uidLogin) return
        let uniqueMem = [...new Set(chatMembers)];
        firebase.firestore()
                .collection('users')
                .where('id', 'in', uniqueMem)
                .onSnapshot(querySnapshot => {
                    let memberData = {}
                    querySnapshot.docs.forEach(doc => {
                        memberData[doc.id] = doc.data()
                    })

                    let cChats = JSON.parse(JSON.stringify(chats))

                    Object.keys(cChats).forEach(key => {
                        // get name
                        if(cChats[key]['name'] == '') {
                            let name = ''
                            cChats[key]['members'].forEach(mem => {
                                if(mem != uidLogin) {
                                    if(name == '') name = memberData[mem]['name']
                                    else name = name + ', ' + memberData[mem]['name']

                                    if(cChats[key]['type'] == 'account')
                                        cChats[key]['accountId'] = mem
                                }
                            })
                            if(name == '') name = memberData[cChats[key]['members'][0]]['name']
                            if(name.length > 20) name = name.substr(0,20) + '...'
                            if(cChats[key]['type'] == 'account' && !cChats[key]['accountId'])
                                cChats[key]['accountId'] = memberData[cChats[key]['members'][0]]['id']
                            cChats[key]['name'] = name
                        } 

                        //get photo
                        if(cChats[key]['photo'] == '') {
                            if(cChats[key]['members'].length == 2) {
                                let photo = ''
                                cChats[key]['members'].forEach(mem => {
                                    if(mem != uidLogin) {
                                        photo = memberData[mem]['photo']
                                    }
                                })
                                if(photo == '') photo = memberData[cChats[key]['members'][0]]['photo']
                                cChats[key]['photo'] = photo
                            }
                        } 
                    })
                    setChatsName(cChats)
                    // console.log(cChats)
                })
    }

    return(
        <LinearGradient
            style={styles.gradient}
            colors={[COLORS.primary2, COLORS.primary1, COLORS.primary]}
        >
            {/* Header */}
            <Header
                navigation={navigation}
            />

            {/* Body */}
            <SafeAreaView style={styles.userOnlineContainer}>

                {/* Search Bar */}
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="search-outline" size={20} color={COLORS.primary}/>
                    <TextInput
                        style={{...FONTS.body3}}
                        placeholder="Tìm kiếm"
                    />
                </View>

                {/* List User Online */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{alignSelf:'center', marginRight:-20,}}
                >
                    {loading ? 
                        (
                            <ActivityIndicator size='small' color='#FFF'/>
                        ):(
                            <Animated.View style={[userOnlAnimate.getLayout(),styles.userOnlineCard]}>
                                {
                                    listUser.map((item, index) => (
                                        <UserOnline
                                            key={item.uid}
                                            username={item.name}
                                            avatar={item.photo}
                                            navigation={navigation}
                                            uid={item.uid}
                                        />
                                    ))
                                }
                            </Animated.View>
                        )
                    }
                </ScrollView>

                {/* List Chat Box */}
                <View style={styles.ListChatboxContainer}>
                    <View style={styles.col}>
                        <Text style={styles.day}>Sunday</Text>
                    </View>
                    <ScrollView>
                        {
                            loading ? (<ActivityIndicator size='large' color='#f20042'/>):
                            (
                                <Animated.View style={[listChatAnimate.getLayout(), styles.listChatbox]}>
                                    {
                                        Object.keys(mergeChat).map((key) => (
                                            <ListChatbox
                                                key={key}
                                                chatName={mergeChat[key]['name']}
                                                avatar={mergeChat[key]['photo']}
                                                count={1}
                                                lastMessage={mergeChat[key]['lastMessage']}
                                                lastTime={'2.am'}
                                                onPress={()=>{
                                                   navigation.navigate('Disscusion', mergeChat[key]['type'] == 'account' ? {
                                                       type: mergeChat[key]['type'],
                                                       userId: mergeChat[key]['accountId']
                                                   } : {
                                                        type: mergeChat[key]['type'],
                                                        idChat: mergeChat[key]['id']
                                                   });
                                                }}
                                            />
                                        ))
                                    }
                                </Animated.View>
                            )
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Home;

const styles = StyleSheet.create({
    userOnlineContainer: {
        flex: 1,
    },
    userOnlineCard:{
        marginLeft:400,
        width:400,
        flexDirection:'row'
    },
    gradient:{
        height:'98%',
        position:"absolute",
        left:0,
        right:0,
        top:0,
        paddingHorizontal:20,
        paddingTop:30
    },
    ListChatboxContainer:{
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        height:530,
        backgroundColor: COLORS.white,
        marginHorizontal:-20
    },
    col:{
        flexDirection:'row',
        marginTop:25,
        marginHorizontal:20,
        alignItems:'center'
    },
    day:{
        ...FONTS.body2
    },
    listChatbox:{
        marginTop:300,
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal:10,
        paddingVertical: 0,
        backgroundColor: COLORS.gray,
        borderRadius:10,
        marginTop: 5,
        height: 40,
        alignItems: 'center',
    }
})