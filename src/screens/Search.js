import React from 'react';
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
import { users } from '../data';

import Header from '../components/Search/Header';

const Search = () => {
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
                        </View>
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