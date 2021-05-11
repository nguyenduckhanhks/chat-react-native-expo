import React, {useEffect, useState} from 'react';
import { TextInput } from 'react-native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '../components/DatePicker';
import * as firebase from 'firebase';
import { RadioButton } from 'react-native-paper';
import { COLORS, icons, FONTS } from '../constants';
import Header from '../components/Profile/Header';
import 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Profile = ({navigation, route}) => {
    const [uidLogin, setUidLogin] = useState('')

    const [uid, setUid] = useState('')
    const [photo, setPhoto] = useState('')
    const [birthday, setBirthday] = useState(new Date(Date.now()))
    const [gender, setGender] = useState('male')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    const [isEdit, setIsEdit] = useState(false)
    const [type, setType] = useState('account')
    const [statusFriend, setStatusFriend] = useState('none')
    const [idRequest, setIdRequest] = useState('none')

    useEffect(() => {
        getData()
    }, [uid])

    const getData =  () => {
        //Check is loginư
         firebase.auth().onAuthStateChanged(user => {
            if(!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
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
                checkStatusFriend()
            }
        })
    }

    const getDataUser =  (uid) => {
         firebase.firestore()
                    .collection('users')
                    .doc(uid)
                    .onSnapshot(querysnapshot => {
                        if(!querysnapshot.data()) {
                            Alert.alert('Không tìm thấy thông tin người dùng!')
                            return navigation.navigate('Login')
                        }
                        let userData = querysnapshot.data()
                        setPhoto(userData['photo'])
                        setBirthday(userData['birthday'] ? new Date(userData['birthday']['seconds'] * 1000) : new Date(Date.now()))
                        setName(userData['name'])
                        setGender(userData['gender'])
                        setTel(userData['tel'])
                        setEmail(userData['email'])
                        setAddress(userData['address'])
                    })
    }

    const checkStatusFriend = () => {
        firebase.firestore()
                .collection('requests')
                .where('from', '==', uidLogin, '||', 'to', '==', uidLogin)
                .onSnapshot(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        if(doc.data()['from'] == uid || doc.data()['to'] == uid) {
                            setStatusFriend(doc.data()['status'])
                            setIdRequest(doc.id)
                        }
                    })
                })
    }

    const onAddRequest = () => {
        if(route && route.params && route.params.type == 'account') {
            let newRequest = {
                from: uidLogin,
                to: uid,
                status: 'waiting'
            }
            firebase.firestore()
                    .collection('requests')
                    .add(newRequest)
                    .then(() => {
                        setStatusFriend('waiting')
                    })
        }
    }

    const removeRequest = () => {
        firebase.firestore()
                    .collection('requests')
                    .doc(idRequest)
                    .delete()
                    .then(() => {
                        setStatusFriend('none')
                    })
    }

    const updateProfile = () => {
        if(!uid) return Alert.alert('Không tìm thấy thông tin người dùng!')

        let dataSend = {}
        if(address) dataSend['address'] = address
        if(gender) dataSend['gender'] = gender
        if(tel) dataSend['tel'] = tel
        if(birthday) dataSend['birthday'] = new Date(birthday)
        if(dataSend) {
            firebase.firestore()
                    .collection('users')
                    .doc(uid)
                    .update(dataSend)
                    .then(async () => {
                        // await firebase.auth().currentUser.updateEmail(email)
                        await getData()
                        setIsEdit(false)
                    })
        }
    }

    const Signout = () => {
        firebase.auth().signOut().then(() => {
            navigation.navigate('Login')
        })
    }
    
    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.primary2, COLORS.primary1, COLORS.primary]}
        >
            <View style={{paddingHorizontal: 20}}>
                <Header navigation = {navigation}/>
            </View>
            <View style={{
                paddingTop: 20,
                backgroundColor: COLORS.gray,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                marginTop: 10,
                }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    //flex: 1
                }}>
                    {/* Avatar */}
                    <Image
                        source={photo ? {uri: photo} : icons.avatar}
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
                        type !== 'myProfile' && statusFriend == 'none' &&
                        <TouchableOpacity 
                            style={{marginLeft: -60, marginTop: 95}} 
                            onPress={() => onAddRequest()}
                        >
                            <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={{}} name="add-outline" size={18} color="#fff"/>
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                    {/* Wait Friend */}
                    {
                        type !== 'myProfile' && statusFriend == 'waiting' &&
                        <TouchableOpacity 
                            style={{marginLeft: -60, marginTop: 95}} 
                            onPress={() => removeRequest()}
                        >
                            <LinearGradient colors={['#f26a50', '#f20042', '#f20045']} style={{width: 30, height: 30,borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon style={{}} name="time-outline" size={18} color="#fff"/>
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                    {/* Remove Friend  */}
                    {
                        type !== 'myProfile' && statusFriend == 'friend' &&
                        <TouchableOpacity 
                            style={{marginLeft: -60, marginTop: 95}} 
                            onPress={() => removeRequest()}
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
                textAlign: 'center',
                paddingTop: 20,
                backgroundColor: COLORS.gray,
            }}>{name}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: COLORS.gray}}>
                <KeyboardAwareScrollView>
                    <View>
                        <DatePicker 
                            model={birthday} 
                            setDate={setBirthday} 
                            label='Ngày sinh:' 
                            disabled={type !== 'myProfile' || !isEdit}
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
                                disabled={!isEdit}
                            /><Text style={{marginRight: 30}}>Nam</Text>
                            <RadioButton 
                                value="female"
                                status={ gender === 'female' ? 'checked' : 'unchecked'}
                                onPress={() => setGender('female')}
                                color="#f20045"
                                disabled={!isEdit}
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
                                editable={isEdit}
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
                            onPress={() => updateProfile()}
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
                    {
                        !isEdit && type === 'myProfile' &&
                        <View style={{...FONTS.body4, marginTop: 10, alignItems: 'center'}}>
                            <Text 
                                style={{fontSize: 17, color: COLORS.primary}}
                                onPress={() => Signout()}
                            >
                                Đăng xuất
                            </Text>
                        </View>
                    }
                </KeyboardAwareScrollView>
            </ScrollView>

        </LinearGradient>
    ) 
}

export default Profile

const styles = StyleSheet.create({
    container:{
        height:'98%',
        position:"absolute",
        left:0,
        right:0,
        top:0,
        paddingTop:30
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