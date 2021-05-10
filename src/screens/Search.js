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

import Header from '../components/Search/Header';

const Search = ({navigation}) => {

    const [listUser, setListUser] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [filterUsers, setFilterUsers] = useState([])
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
    //Call when component is rendered
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <View style={styles.container}>
            <Header/>
            <SafeAreaView style={{height: '95%'}}>
                {/* Search Bar */}
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="search-outline" size={20} color={COLORS.primary}/>
                    <TextInput
                        style={{...FONTS.body3, flex: 1}}
                        placeholder="Tìm kiếm"
                        clearButtonMode='while-editing'
                        onChangeText={text => {
                            console.log(text)
                            const _text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            const _filters = text == "" ? listUser : listUser.filter(user => {
                                return user["name"].toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(_text)
                            })
                            console.log(_filters)
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
                        onPress = { () => navigation.navigate('Profile', {
                            type:'account',
                            userId: item["id"]
                        }) }
                     >
                        <View 
                            style={styles.rowUser}
                            key={item["_id"]}
                        >       
                                <Image source={{uri: item["photo"] == "" ? "https://ui-avatars.com/api/?name="+item["name"]+"&background=random" : item["photo"]}} style={styles.avatar}/>
                                <View style={styles.boxUsername}>
                                    <Text style={styles.username}>{item["name"]}</Text>
                                </View>
                        </View>
                    </TouchableOpacity>
                    )
                }
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default Search

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
        paddingLeft: 10,
        width: '90%',
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
    }
})