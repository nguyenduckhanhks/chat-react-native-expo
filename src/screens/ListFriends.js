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
import { COLORS, FONTS } from '../constants';
import { users } from '../data';
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';

import Header from '../components/ListFriends/Header';

const ListFriends = () => {
    const [uidLogin, setUidLogin] = useState('')
    const [listRequest, setListRequest] = useState([])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })

        getListRequest()
    }, [])

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

                {/* Danh sách  */}
                <ScrollView style={{paddingBottom: 50}}>
                {
                    users.map((item) => 
                        <View 
                            style={styles.rowUser}
                            key={item.id}
                        >       
                                <Image source={{uri: item.avatar_url}} style={styles.avatar}/>
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item.login}</Text>
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
        ...FONTS.body2,
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
        marginTop:15
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