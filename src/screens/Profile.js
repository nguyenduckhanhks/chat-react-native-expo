import React, {useEffect, useState} from 'react';
import { TextInput } from 'react-native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '../components/DatePicker';
import * as firebase from 'firebase';
import { RadioButton } from 'react-native-paper';
import { COLORS, icons } from '../constants';
import 'firebase/firestore';

const Profile = ({navigation, route}) => {
    const [uidLogin, setUidLogin] = useState('')

    const [uid, setUid] = useState('')
    const [birthday, setBirthday] = useState(new Date(Date.now()))
    const [gender, setGender] = useState('male')
    const [email, setEmail] = useState('admin@gmail.com')
    const [tel, setTel] = useState('0963526978')
    const [name, setName] = useState('Nguyễn Đức Khánh')
    const [address, setAddress] = useState('')

    const [isEdit, setIsEdit] = useState(false)
    const [type, setType] = useState('myProfile')
    const [isFriend, setIsFriend] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        //Check is login
        await firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
        })

        //get Uid login
        let user = await firebase.auth()
        if(!user) return navigation.navigate('Login')

        if(user['currentUser']) {
        let uidLogin = user['currentUser']['uid']
        setUidLogin(uidLogin)

        // Get my profile
        if(route && route.params && route.params.type == 'myProfile') {
            setUid(uidLogin)
            setType(route.params.type)
            getDataUser(uidLogin)
        }

        if(route && route.params && route.params.type == 'account') {
            let uid = route.params.userId
            setUid(uid)
            setType(route.params.type)
            getDataUser(uid)
        }
        }
    }

    const getDataUser = async (uid) => {
        let userData = await firebase.firestore()
                                    .collection('users')
                                    .doc(uid)
                                    .get()
                                    .then((querySnapshot) => {
                                            // querySnapshot.forEach((doc) => {
                                            //     console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                                            // })
                                            // console.log(querySnapshot.data())
                                    })
        console.log(uid)
        if(!userData['_data']) {
            Alert.alert('Không tìm thấy thông tin người dùng!')
            // return navigation.navigate('Login')
        }
        setBirthday(userData['_data']['birthday'])
        setName(userData['_data']['name'])
        setGender(userData['_data']['gender'])
        setTel(userData['_data']['tel'])
        setEmail(user['_user']['email'])
        setAddress(user['_user']['address'])
    }
    
    return (
        <SafeAreaView style={{paddingHorizontal: 10, paddingBottom: 80}}>
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
                    {
                        type === 'myProfile' && 
                        <TouchableOpacity 
                            style={{marginLeft: -30, marginTop: 13}} 
                            onPress={() => {}}
                        >
                            <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={{}} name="pencil-outline" size={18} color="#fff"/>
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                    {/* Add Friend */}
                    {
                        type !== 'myProfile' && !isFriend &&
                        <TouchableOpacity 
                            style={{marginLeft: -60, marginTop: 95}} 
                            onPress={() => {}}
                        >
                            <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={{}} name="add-outline" size={18} color="#fff"/>
                                {/* <Icon style={{}} name="checkmark-outline" size={18} color="#fff"/> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                    {/* Remove Friend  */}
                    {
                        type !== 'myProfile' && isFriend &&
                        <TouchableOpacity 
                            style={{marginLeft: -60, marginTop: 95}} 
                            onPress={() => {}}
                        >
                            <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={{}} name="checkmark-outline" size={18} color="#fff"/>
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                </View>
            </View>

            <Text style={{
                fontSize: 35,
                textAlign: 'center'
            }}>{name}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View>
                    <DatePicker 
                        model={birthday} 
                        setDate={setBirthday} 
                        label='Ngày sinh:' 
                        disabled={false}
                    />
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Giới tính:</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: 10,
                        backgroundColor: COLORS.white
                    }}>
                        <RadioButton 
                            value="male"
                            status={ gender === 'male' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('male')}
                            color="#f20045"
                            // disabled={!isEdit}
                        /><Text style={{marginRight: 30}}>Nam</Text>
                        <RadioButton 
                            value="female"
                            status={ gender === 'female' ? 'checked' : 'unchecked'}
                            onPress={() => setGender('female')}
                            color="#f20045"
                            // disabled={!isEdit}
                        /><Text>Nữ</Text>
                    </View>
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Số điện thoại:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput 
                            placeholder='Số điện thoại'
                            style={{
                                fontSize: 16,
                            }}
                            value={tel}
                            onChangeText={setTel}
                            editable={isEdit}
                        />
                    </View>
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Email:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput 
                            placeholder='Email'
                            style={{
                                fontSize: 16,
                            }}
                            value={email}
                            onChangeText={setEmail}
                            editable={false}
                        />
                    </View>
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Địa chỉ:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput 
                            placeholder='Địa chỉ'
                            style={{
                                fontSize: 16,
                            }}
                            value={address}
                            onChangeText={setAddress}
                            editable={isEdit}
                        />
                    </View>
                </View>

                {
                    !isEdit && type === 'myProfile' &&
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => {
                            setIsEdit(true)
                        }}
                    >
                        <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={styles.gradient}>
                            <Text style={styles.text}>
                                    Chỉnh sửa</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }

                <View style={{flexDirection: 'row'}}>
                {
                    isEdit && type === 'myProfile' &&
                    <TouchableOpacity 
                        style={[styles.button1, {marginLeft: '10%'}]} 
                        onPress={() => {}}
                    >
                        <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={styles.gradient}>
                            <Text style={styles.text}>
                                    Lưu</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }

                {
                    isEdit && type === 'myProfile' &&
                    <TouchableOpacity 
                        style={[styles.button1, {marginLeft: '10%'}]} 
                        onPress={() => {
                            setIsEdit(false)
                        }}
                    >
                        <LinearGradient colors={[COLORS.darkgray, COLORS.darkgray]} style={styles.gradient}>
                            <Text style={styles.text}>
                                    Hủy</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }
                </View>
            </ScrollView>

        </SafeAreaView>
    ) 
}

export default Profile

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
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 18,
    },
    backgroundInput: {
        flex: 1,
        flexDirection: 'row',
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
    }
})