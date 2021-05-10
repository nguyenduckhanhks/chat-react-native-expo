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
    }, [])

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
                    console.log(usersData.length)
                    setLoading(false)
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
                            loading || Object.keys(users).length == 0 ? (<ActivityIndicator size='large' color='#f20042'/>):
                            (
                                <Animated.View style={[listChatAnimate.getLayout(), styles.listChatbox]}>
                                    {
                                        Object.keys(users).map((key) => (
                                            <ListChatbox
                                                key={key}
                                                chatName={users[key]['login']}
                                                avatar={users[key].avatar_url}
                                                count={1}
                                                lastMessage={'hello, how are you'}
                                                lastTime={'2.am'}
                                                onPress={()=>{
                                                   navigation.navigate('Disscusion');
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