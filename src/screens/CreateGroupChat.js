import React, {useEffect, useState} from 'react';
import {RefreshControl, TouchableOpacity} from 'react-native';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import * as firebase from 'firebase';
import 'firebase/firestore'; 
import { LinearGradient } from 'expo-linear-gradient';
import { RadioButton } from 'react-native-paper';

import Header from '../components/CreateGroupChat/Header';

const TYPE_ACCOUNT = 'account'
const TYPE_GROUP = 'group'

const CreateGroupChat = ({navigation}) => {
    const [uidLogin, setUidLogin] = useState('')

    const [listUser, setListUser] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [filterUsers, setFilterUsers] = useState([])

    const [selectedUser, setSelectedUser] = useState([])

    //Call when component is rendered
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })

        getUsers();
    }, []);

    const getUsers = () => {
        try {
            setRefreshing(true)
            firebase.firestore().collection("users").onSnapshot(querySnap => {
                const list = querySnap.docs.map((doc) => {
                    let user = doc.data();
                    return {
                        _id: doc.id,
                        ...user
                    }
                });
                list.sort((a, b) => {
                    return (a["name"] < b["name"]) ? -1 : ((a["name"] > b["name"]) ? 1 : 0)
                })
                setListUser(list);
                setFilterUsers(list);
            });
            setRefreshing(false)
        } catch (e) {
            console.log(e);
            setRefreshing(false)
        }
    };

    const toggleSelectUser = (uid) => {
        let tmp = JSON.parse(JSON.stringify(selectedUser))
        if(tmp.includes(uid)) tmp.splice(tmp.indexOf(uid), 1)
        else tmp.push(uid)

        setSelectedUser(tmp)
    }

    const createNewChat = () => {
        if(!uidLogin) return;
        let tmp = JSON.parse(JSON.stringify(selectedUser))
        if(!tmp.includes(uidLogin)) tmp.push(uidLogin)
        let newChat = {
            name: '',
            admin: uidLogin,
            photo: '',
            members: tmp,
            type: TYPE_GROUP
        }
        firebase.firestore()
                .collection('chats')
                .add(newChat)
                .then(res => {
                    updateIdChat(res.id)
                })
                .then(() => {
                    navigation.navigate('Disscusion', {
                        type: TYPE_GROUP,
                        chatid: res.id
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
    
    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <SafeAreaView style={{height: '95%'}}>
                {/* Search Bar */}
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="search-outline" size={20} color={COLORS.primary}/>
                    <TextInput
                        style={{...FONTS.body3, flex: 1}}
                        placeholder="Tìm kiếm"
                        clearButtonMode='while-editing'
                        onChangeText={text => {
                            // console.log(text)
                            const _text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            const _filters = text == "" ? listUser : listUser.filter(user => {
                                return user["name"].toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(_text)
                            })
                            // console.log(_filters)
                            setFilterUsers(_filters)
                        }}
                    />
                </View>
                <ScrollView style={{marginBottom: 50}} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={getUsers}
                        />
                      }
                    >
                {
                    filterUsers.map((item) =>
                    <TouchableOpacity 
                        key={item["_id"]}
                        onPress = { () => toggleSelectUser(item['id'])}
                     >
                        <View 
                            style={styles.rowUser}
                            key={item["_id"]}
                        >       
                                <Image source={{uri: item["photo"] == "" ? "https://ui-avatars.com/api/?name="+item["name"]+"&background=random" : item["photo"]}} style={styles.avatar}/>
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item["name"]}</Text>
                                </View>
                                <RadioButton 
                                    value="male"
                                    status={ selectedUser.includes(item['id']) ? 'checked' : 'unchecked'}
                                    onPress={() => toggleSelectUser(item['id'])}
                                    color="#f20045"
                                />
                        </View>
                    </TouchableOpacity>
                    )
                }
                </ScrollView>
                <TouchableOpacity 
                    style={[styles.button]} 
                    onPress={() => createNewChat()}
                >
                    <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={styles.gradient}>
                        <Text style={styles.text}>
                                Tạo phòng chat</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

export default CreateGroupChat

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
        marginLeft: -15,
    },
    username:{
        ...FONTS.body2,
        width: '80%',
        alignItems: 'center',
        justifyContent:'center',
        alignContent: 'center',
    },
    boxUsername: {
        paddingBottom: 10,
        paddingLeft: 7,
        width: '83%',
        justifyContent: 'flex-end',
        alignContent: 'center',
    },
    rowUser: {
        flexDirection:'row',
        paddingHorizontal:20,
        paddingVertical: 10,
        alignItems:'center',
        alignItems: 'stretch',
        borderBottomColor: COLORS.darkgray,
        borderBottomWidth: 0.5,
    },
    gradient:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 25
    },
    text: {
        color: COLORS.white,
        fontSize: 20,
    },
    button: {
        width: '70%',
        marginLeft:'15%',
        marginTop: 40,
        height: 50,
    },
})