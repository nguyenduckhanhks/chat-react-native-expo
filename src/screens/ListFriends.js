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

const ListFriends = () => {
    const [uidLogin, setUidLogin] = useState('')
    const [listRequest, setListRequest] = useState([])
    const [listUserRequest, setListUserRequest] = useState([])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })

        getListRequest()
    }, [uidLogin])

    useEffect(() => {
        getListUserRequest()
    }, [listRequest])

    const getListRequest = () => {
        firebase.firestore()
                .collection('requests')
                .where('to', '==', uidLogin)
                .onSnapshot(querySnapshot => {
                    const listReq = querySnapshot.docs.map(doc => {
                        return {
                            idRequest: doc.id,
                            userId: doc.data()['from']
                        }
                    })
                    setListRequest(listReq)
                })
    }
    
    const getListUserRequest = () => {
        if(listRequest.length == 0) return;
        let listUserIdRequest = listRequest.map(req => req['userId'])
        firebase.firestore()
                .collection('users')
                .where('id', 'in', listUserIdRequest)
                .onSnapshot(querySnapshot => {
                    const listUser = querySnapshot.docs.map(doc => {
                        const data = doc.data()
                        return {
                            uid: doc.id,
                            ...data
                        }
                    })
                    setListUserRequest(listUser)
                })
    }

    const acceptRequest = () => {
        let listUserIdRequest = listRequest.map(req => req['userId'])
        let index = listUserIdRequest.filter(uerId => userId == uidLogin)[0]
        let requestData = listRequest[index]

        firebase.firestore()
                .collection('request')
                .doc(requestData['idRequest'])
                .update({
                    status: 'friend'
                })
                .then(() => {
                    
                })
    }

    return (
        <View style={styles.container}>
            <Header/>
            <SafeAreaView style={{height: '95%'}}>
                {/* Search Bar */}
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="search-outline" size={20} color={COLORS.primary}/>
                    <TextInput
                        style={{...FONTS.body3}}
                        placeholder="Tìm kiếm"
                    />
                </View>

                {/* Menu */}
                <View style={{flexDirection: 'row', marginVertical: 20}}>
                    <TouchableOpacity 
                        style={{
                            width: '48%',
                            marginRight: '2%'
                        }}
                    >
                        <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} 
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
                    >
                        <LinearGradient colors={[COLORS.darkgray,COLORS.darkgray]} 
                            style={{
                                paddingVertical: 15,
                                backgroundColor: COLORS.white,
                                borderRadius:  20,
                                alignItems: 'center',
                                marginRight: '2%'
                            }}
                        >
                            <Text style={{...FONTS.h4}}>Bạn bè</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Danh sách yêu cầu kết bạn */}
                <ScrollView style={{paddingBottom: 50}}>
                {
                    listUserRequest.map((item) => 
                        <View 
                            style={styles.rowUser}
                            key={item.uid}
                        >       
                                <Image source={item.photo ? {uri: item.photo} : icons.avatar} style={styles.avatar}/>
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item.name}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        position: 'absolute',
                                        right: 60,
                                    }}
                                >
                                    <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} 
                                    style={styles.buttonAccept}
                                >
                                        <Text style={{...FONTS.body4, color: COLORS.white}}>Xác nhận</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonXoa}>
                                    <Text style={{...FONTS.body4}}>Xóa</Text>
                                </TouchableOpacity>
                        </View>
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