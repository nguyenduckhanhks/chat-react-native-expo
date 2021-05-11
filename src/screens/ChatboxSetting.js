import React, {useEffect, useState} from 'react';
import { Alert, TextInput } from 'react-native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, icons, FONTS } from '../constants';
import * as firebase from 'firebase';
import {users} from '../data';

const ChatboxSetting = ({route, navigation}) => {
    const [uidLogin, setUidLogin] = useState('')
    const [name, setName] =  useState('')
    const [memberData, setMemberData] = useState([])
    const [chatData, setChatData] = useState({})
    const [rightAvatar, setRightAvatar] = useState('')
    const [admin, setAdmin] = useState([])
    const [modal, setModal] = useState(false)
    const [selectUser, setSelectUser] = useState(null)
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getChatAvatar()
        getChatName()
        getAdmin()
        setMember()
    }, [uidLogin])

    useEffect(() => {
        setMemberData(route.params.memberData)
        setChatData(route.params.chatData)
    }, [route.params.chatData, route.params.memberData])

    useEffect(() => {
        getChatAvatar()
        getChatName()
    }, [memberData, chatData])

    useEffect(() => {
        setMember()
        getChatAvatar()
        getChatName()
        getAdmin()
    }, [chatData])

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

        let name = ''
        memberData.forEach(element => {
            if(chatData['type'] == 'account') {
                if(element['id'] != uidLogin) return setName(element['name'])
            }
            else {
                if(name == '') name = element['name']
                else name = name + ', ' + element['name']
            } 
        });
        if(name.length > 20) name = name.substr(0,20) + '...'
        setName(name)
    }

    const getAdmin = () => {
        if(!chatData || !memberData || !uidLogin) return;
        memberData.forEach(mem => {
            if(mem['id'] == chatData['admin']) {
                setAdmin([mem])
            }
        })
    }

    const removeMember = () => {
        let members = JSON.parse(JSON.stringify(chatData['members']))
        members.splice(members.indexOf(selectUser['id']), 1)
        firebase.firestore()
                .collection('chats')
                .doc(chatData['id'])
                .update({
                    members: members
                })
                .then(() => {
                    setModal(false)
                    setSelectUser(null)
                    getChatData()
                })
    }

    const updateAdmin = () => {
        firebase.firestore()
                .collection('chats')
                .doc(chatData['id'])
                .update({
                    admin: selectUser['id']
                })
                .then(() => {
                    setModal(false)
                    setSelectUser(null)
                    getChatData()
                })
    }

    const getChatData = () => {
        if(!uidLogin) return;

        firebase.firestore()
                .collection('chats')
                .doc(chatData['id'])
                .onSnapshot(doc => {
                    console.log(doc.data())
                    setChatData({
                        id: doc.id,
                        ...doc.data()
                    })
                })
    }

    const setMember = () => {
        if(!route.params.memberData || !chatData || !chatData['members']) return;
        let tmp = JSON.parse(JSON.stringify(route.params.memberData))
        setMemberData(tmp.filter(data => chatData['members'].includes(data['id'])))
    }
    
    return (
        <SafeAreaView style={{paddingHorizontal: 20, paddingBottom: 80}}>
            <View style={{ flexDirection: 'row', height: 50, marginLeft: 20}}>
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
            </View>
            <View style={{height: 100, marginBottom: 30}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flex: 1
                }}>
                    {/* Avatar */}
                    <Image
                        source={rightAvatar ? {uri: rightAvatar} : icons.avatar}
                        style={{
                            width: 100,
                            height: 100,
                            marginVertical: 15,
                            borderRadius: 50,
                        }}
                    />

                    {/* Edit Avatar */}
                    <TouchableOpacity 
                        style={{marginLeft: -30, marginTop: 13}} 
                        onPress={() => {}}
                    >
                        <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon style={{}} name="pencil-outline" size={18} color="#fff"/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{paddingHorizontal: 10}}>
                <Text style={{
                    fontSize: 35,
                    textAlign: 'center'
                }}>{name}</Text>
            </View>

                <View style={{marginTop: 20, paddingHorizontal: 10, marginTop: 40, marginBottom: 180}}>

                    {/* Admin */}
                    <Text style={[styles.title, {marginBottom:10}]}> Quản trị viên:</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{height: 150, borderRadius: 30}}>
                        <View style={styles.nomalField}>
                            <View style={styles.backgroundInput}>
                                {
                                    admin.map((item) => 
                                    <View 
                                        style={styles.rowUser}
                                        key={item.id}
                                    >       
                                            <Image source={item['photo'] ? {uri: item['photo']} : icons.avatar} style={styles.avatar}/>
                                            <View style={styles.boxUsername}>
                                                <Text style={styles.username}>{item['name']}</Text>
                                            </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>


                    {/* Thành viên */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.title, {marginBottom:10}]}> Thành viên:</Text>
                        <TouchableOpacity 
                            onPress={() => {
                                navigation.navigate('AddMember', {
                                    chatId: chatData['id'],
                                    members: chatData['members']
                                })
                            }}
                        >
                                <Text style={[styles.title, {color: COLORS.primary, marginBottom: 10, marginLeft: '40%'}]}>
                                        Thêm thành viên</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{height: 150, borderRadius: 30}}>
                        <View style={styles.nomalField}>
                            <View style={styles.backgroundInput}>
                                {
                                    memberData.map((item) => 
                                    <TouchableOpacity 
                                        style={styles.rowUser}
                                        key={item.id}
                                        onPress={() => {
                                            if(uidLogin == admin[0]['id']) {
                                                setModal(true)
                                                setSelectUser(item)
                                            }
                                        }}
                                    >       
                                            <Image source={item['photo'] ? {uri: item['photo']} : icons.avatar} style={styles.avatar}/>
                                            <View style={styles.boxUsername}>
                                                <Text style={styles.username}>{item['name']}</Text>
                                            </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => {
                            setIsEdit(true)
                        }}
                    >
                        <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={styles.gradient}>
                            <Text style={styles.text}>
                                    Rời khỏi phòng chat</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        setModal(!modal)
                    }}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={[styles.menu, styles.border]}>
                            <Text style={{...FONTS.h3, textAlign: 'center', color: COLORS.primary}}>{selectUser ? selectUser['name'] : ''}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => updateAdmin()}>
                            <Text style={{...FONTS.body3, textAlign: 'center'}}>Đặt làm quản trị viên</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => removeMember()}>
                            <Text style={{...FONTS.body3, textAlign: 'center'}}>Xóa khỏi nhóm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menu} onPress={() => setModal(false)}>
                            <Text style={{...FONTS.body3, textAlign: 'center'}}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
        </SafeAreaView>
    ) 
}

export default ChatboxSetting

const styles = StyleSheet.create({
    menu: { 
        width: '100%', 
        paddingVertical: 20,
    },
    border: {  
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1
    },
    modalView: {
        backgroundColor: COLORS.white,
        color: COLORS.black,
        borderRadius: 20,
        marginBottom: 35,
        marginLeft: '3%',
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        bottom: 0,
        position: 'absolute',
        width: '95%',
    },
    gradient:{
        height:'100%',
        position:"absolute",
        left:0,
        right:0,
        top:0,
        paddingHorizontal:20,
        paddingTop:30
    },
    nomalField: {
        marginVertical: 10,
        marginLeft: 7,
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        // paddingLeft: 10,
        backgroundColor: COLORS.lightGray2,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
    },
    backgroundInput: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: COLORS.lightGray2
    },
    gradient:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 25
    },
    button: {
        width: '70%',
        marginLeft:'15%',
        marginTop: 40,
        height: 50,
    },
    button1: {
        width: '35%',
        marginTop: 40,
        height: 50,
    },
    text: {
        color: COLORS.white,
        fontSize: 20,
    },
    avatar:{
        width:50,
        height:50,
        borderRadius:25,
        marginRight: 10,
        marginLeft: -15
    },
    username:{
        ...FONTS.body2,
        width: '80%',
        alignItems: 'center',
        justifyContent:'center',
    },
    boxUsername: {
        borderBottomColor: COLORS.darkgray,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        paddingLeft: 10,
        width: '90%',
        flexDirection:'row',
    },
    rowUser: {
        flexDirection:'row',
        paddingHorizontal:20,
        alignItems:'center',
        marginTop:15
    }
})