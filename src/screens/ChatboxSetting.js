import React, {useEffect, useState} from 'react';
import { TextInput } from 'react-native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
// import firebase from 'react-native-firebase';
import { COLORS, icons, FONTS } from '../constants';
import {users} from '../data'

const ChatboxSetting = (props) => {
    const [uids, setUids] = useState('')
    const [birthday, setBirthday] = useState(new Date(Date.now()))
    const [gender, setGender] = useState('male')
    const [email, setEmail] = useState('admin@gmail.com')
    const [name, setName] = useState('Nguyễn Đức Khánh')

    const [type, setType] = useState('myProfile')
    const [isFriend, setIsFriend] = useState(false)
    
    return (
        <SafeAreaView style={{paddingHorizontal: 20, paddingBottom: 80}}>
            <View style={{height: 100, marginBottom: 30}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flex: 1
                }}>
                    {/* Avatar */}
                    <Image
                        source={icons.avatar}
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

            <Text style={{
                fontSize: 35,
                textAlign: 'center'
            }}>{name}</Text>

                <View style={{marginTop: 20, paddingHorizontal: 10, marginTop: 40, marginBottom: 180}}>

                    {/* Admin */}
                    <Text style={[styles.title, {marginBottom:10}]}> Quản trị viên:</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{height: 150, borderRadius: 30}}>
                        <View style={styles.nomalField}>
                            <View style={styles.backgroundInput}>
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
                                    </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>


                    {/* Thành viên */}
                    <Text style={[styles.title, {marginTop: 20, marginBottom:10}]}> Nhân viên:</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{height: 150, borderRadius: 30}}>
                        <View style={styles.nomalField}>
                            <View style={styles.backgroundInput}>
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
                                    </View>
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
        </SafeAreaView>
    ) 
}

export default ChatboxSetting

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.white,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
    },
    backgroundInput: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: COLORS.white
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