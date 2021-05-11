import React from 'react';
import { View, TouchableOpacity, Image, Text} from 'react-native';
import { icons, SIZES, COLORS, FONTS } from '../../constants';

const Header = ({navigation}) => {

    return (
        <View style={{ flexDirection: 'row', height: 50 }}>
            <TouchableOpacity
                style={{
                    width: 30,
                    paddingLeft: 0,
                    justifyContent: 'center'
                }}
                onPress={() => navigation.pop()}
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
                    <Text style={{ ...FONTS.h3 }}>Thêm thành viên</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 30,
                    paddingRight: 0,
                    justifyContent: 'center'
                }}
                onPress={() => navigation.navigate('NewPost')}
            >
            </TouchableOpacity>
        </View>
    )
}

export default Header