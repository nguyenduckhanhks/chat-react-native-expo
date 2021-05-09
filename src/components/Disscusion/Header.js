import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import { icons, SIZES, COLORS, FONTS } from '../../constants';

const Header = ({navigation}) => {

    return (
        <View style={{ flexDirection: 'row', height: 50, marginTop: 10 }}>
            <TouchableOpacity
                style={{
                    width: 30,
                    paddingLeft: 0,
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View
                    style={{
                        width: '70%',
                        height: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: SIZES.radius
                    }}
                >
                    <Text style={{ ...FONTS.h3 }}>Tên Chatbox</Text>
                    <Text style={{ ...FONTS.body5 }}>Yesterday</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 30,
                    paddingRight: 0,
                    justifyContent: 'center'
                }}
            >
                <Image 
                    source={icons.avatar} 
                    style={styles.avatar}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    avatar:{
        width:40,
        height:40,
        borderRadius:20,
    }
})