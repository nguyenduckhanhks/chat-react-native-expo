import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, icons } from '../constants';
import { users } from '../data';
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';

import Header from '../components/ListFriends/Header';

const ListFriends = ({navigation}) => {
    const [uidLogin, setUidLogin] = useState('')
    const [listRequest, setListRequest] = useState([])
    const [listUserRequest, setListUserRequest] = useState([])

    const [listFriend, setListFriend] = useState([])
    const [listUserFriend, setListUserFriend] = useState([])

    const [filterUserRequest, setFilterUserRequest] = useState([])
    const [filterUserFriend, setFilterUserFriend] = useState([])
    const [mode, setMode] = useState('req')

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })

        getListRequest('waiting', setListRequest)
        getListFriend('friend', setListFriend)
    }, [uidLogin])

    useEffect(() => {
        getListUserRequest(listRequest, setListUserRequest, setFilterUserRequest)
    }, [listRequest])

    useEffect(() => {
        getListUserRequest(listFriend, setListUserFriend, setFilterUserFriend)
    }, [listFriend])

    const getListRequest = (condition, setState) => {
        firebase.firestore()
                .collection('requests')
                .where('to', '==', uidLogin)
                .where('status', '==', condition)
                .onSnapshot(querySnapshot => {
                    const listReq = querySnapshot.docs.map(doc => {
                        return {
                            idRequest: doc.id,
                            userId: doc.data()['from']
                        }
                    })
                    setState(listReq)
                })
    }

    const getListFriend = (condition, setState) => {
        firebase.firestore()
                .collection('requests')
                .where('to', '==', uidLogin, '||', 'from', '==', uidLogin)
                .where('status', '==', condition)
                .onSnapshot(querySnapshot => {
                    const listReq = querySnapshot.docs.map(doc => {
                        return {
                            idRequest: doc.id,
                            userId: doc.data()['from']
                        }
                    })
                    setState(listReq)
                })
    }
    
    const getListUserRequest = (listRequest, setState, setFilter) => {
        if(listRequest.length == 0) {
            setFilter([]);
            return setState([]);
        }
        let listUserIdRequest = listRequest.map(req => req['userId'])
        firebase.firestore()
                .collection('users')
                .where('id', 'in', listUserIdRequest)
                .onSnapshot( querySnapshot => {
                    const listUser = querySnapshot.docs.map(doc => {
                        const data = doc.data()
                        return {
                            uid: doc.id,
                            ...data
                        }
                    })
                    setState(listUser)
                    setFilter(listUser)
                })
    }

    const acceptRequest = (uid) => {
        let listUserIdRequest = listRequest.map(req => req['userId'])
        let index = listUserIdRequest.indexOf(uid)
        let requestData = listRequest[index]

        firebase.firestore()
                .collection('requests')
                .doc(requestData['idRequest'])
                .update({
                    status: 'friend'
                })
                .then(() => {
                    getListRequest('waiting', setListRequest)
                    getListFriend('friend', setListFriend)
                })
    }
    
    const removeRequest = (uid) => {
        let listUserIdRequest = listRequest.map(req => req['userId'])
        let index = listUserIdRequest.indexOf(uid)
        let requestData = listRequest[index]

        firebase.firestore()
                .collection('requests')
                .doc(requestData['idRequest'])
                .delete()
                .then(() => {
                    getListRequest('waiting', setListRequest)
                    getListFriend('friend', setListFriend)
                })
    }

    const removeFriend = (uid) => {
        let listUserIdFriend = listFriend.map(req => req['userId'])
        let index = listUserIdFriend.indexOf(uid)
        let requestData = listFriend[index]

        firebase.firestore()
                .collection('requests')
                .doc(requestData['idRequest'])
                .delete()
                .then(() => {
                    getListRequest('waiting', setListRequest)
                    getListRequest('friend', setListFriend)
                })
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation}/>
            <SafeAreaView style={{height: '95%'}}>
                {/* Search Bar */}
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="search-outline" size={20} color={COLORS.primary}/>
                    <TextInput
                        style={{...FONTS.body3}}
                        placeholder="Tìm kiếm"
                        onChangeText={text => {
                            // console.log(text)
                            let listUser =listUserRequest
                            let _text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            let _filters = text == "" ? listUser : listUser.filter(user => {
                                return user["name"].toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(_text)
                            })
                            // console.log(_filters)
                            setFilterUserRequest(_filters)

                            listUser =listUserFriend
                            _text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            _filters = text == "" ? listUser : listUser.filter(user => {
                                return user["name"].toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(_text)
                            })
                            // console.log(_filters)
                            setFilterUserFriend(_filters)
                        }}
                    />
                </View>

                {/* Menu */}
                <View style={{flexDirection: 'row', marginVertical: 20}}>
                    <TouchableOpacity 
                        style={{
                            width: '48%',
                            marginRight: '2%'
                        }}
                        onPress={() => setMode('req')}
                    >
                        <LinearGradient colors={mode == 'req' ? ['#f26a50', '#f20042', '#f20045'] : [COLORS.darkgray,COLORS.darkgray]} 
                            style={{
                                paddingVertical: 15,
                                backgroundColor: COLORS.white,
                                borderRadius:  20,
                                alignItems: 'center',
                                marginRight: '2%'
                            }}
                        >
                            <Text style={{...FONTS.h4, color: COLORS.white}}>Yêu cầu kết bạn</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            width: '48%',
                            marginRight: '2%'
                        }}
                        onPress={() => setMode('friend')}
                    >
                        <LinearGradient colors={mode == 'req' ? [COLORS.darkgray,COLORS.darkgray] : ['#f26a50', '#f20042', '#f20045']} 
                            style={{
                                paddingVertical: 15,
                                backgroundColor: COLORS.white,
                                borderRadius:  20,
                                alignItems: 'center',
                                marginRight: '2%'
                            }}
                        >
                            <Text style={{...FONTS.h4, color: COLORS.white}}>Bạn bè</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Danh sách yêu cầu kết bạn */}
                <ScrollView style={{paddingBottom: 50}}>
                {
                    mode == 'req' && filterUserRequest.map((item) => 
                        <TouchableOpacity 
                            style={styles.rowUser}
                            key={item.uid}
                            onPress={() => navigation.navigate('Profile', {
                                type: 'account',
                                userId: item.uid
                            })}
                        >       
                                <Image 
                                    source={item.photo ? {uri: item.photo} : icons.avatar} 
                                    style={styles.avatar}
                                />
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item.name}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        position: 'absolute',
                                        right: 60,
                                    }}
                                    onPress={() => acceptRequest(item.uid)}
                                >
                                    <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} 
                                    style={styles.buttonAccept}
                                >
                                        <Text style={{...FONTS.body4, color: COLORS.white}}>Xác nhận</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonXoa} onPress={() => removeRequest(item.uid)} >
                                    <Text style={{...FONTS.body4}}>Xóa</Text>
                                </TouchableOpacity>
                        </TouchableOpacity>
                    )
                }
                {
                    mode == 'friend' && filterUserFriend.map((item) => 
                        <TouchableOpacity 
                            style={styles.rowUser}
                            key={item.uid}
                            onPress={() => navigation.navigate('Profile', {
                                type: 'account',
                                userId: item.uid
                            })}
                        >       
                                <Image source={item.photo ? {uri: item.photo} : icons.avatar} style={styles.avatar}/>
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item.name}</Text>
                                </View>
                                <TouchableOpacity style={styles.buttonXoa} onPress={() => removeFriend(item.uid)}>
                                    <Text style={{...FONTS.body4}}>Xóa</Text>
                                </TouchableOpacity>
                        </TouchableOpacity>
                    )
                }
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default ListFriends

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:20,
        position:"absolute",
        left:0,
        right:0,
        top:0,
        height:'95%',
        paddingTop:30
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal:10,
        paddingVertical: 0,
        backgroundColor: COLORS.white,
        borderRadius:10,
        marginTop: 5,
        height: 40,
        alignItems: 'center',
    },
    avatar:{
        width:50,
        height:50,
        borderRadius:25,
        marginRight: 10,
        marginLeft: -15
    },
    username:{
        ...FONTS.body3,
        width: '80%',
        alignItems: 'center',
        justifyContent:'center',
    },
    boxUsername: {
        paddingBottom: 10,
        paddingLeft: 10,
        width: '90%',
        flexDirection:'row',
    },
    rowUser: {
        flexDirection:'row',
        paddingHorizontal:20,
        alignItems:'center',
        marginTop:15,
        alignContent: 'center'
    },
    buttonXoa: {
        position: 'absolute',
        right: 0,
        backgroundColor: COLORS.gray,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1
    },
    buttonAccept: {
        backgroundColor: COLORS.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10
    }
})