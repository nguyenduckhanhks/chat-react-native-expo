import React, {useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FONTS } from '../../constants';
import {dataMessageConst} from '../../data';
import { icons, SIZES, COLORS } from '../../constants';

import Received from './Received';
import Sent from './Sent';

const ChatPanel = ({dataMessage, uidLogin, memberData}) => {
    const [modal, setModal] = useState(false)
    const formatTime = (unix_timestamp) => {
        var date = new Date(unix_timestamp);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();

        var formattedTime = hours + ':' + minutes.substr(-2);
        return formattedTime
    }
    return(
        <ScrollView showsVerticalScrollIndicator={false} style={{height: '95%'}}>
            {dataMessage && 
                dataMessage.map((data, index) => {
                    if(uidLogin == data['owner']) return (
                        <Sent
                            key={index}
                            message={data['content']}
                            create={data['create']}
                            setModal={setModal}
                            time = {formatTime(data['created'])}
                        />
                    ) 
                    else return (
                        <Received 
                            key={index}
                            message={data['content']}
                            create={'abc'}
                            owner={data['owner']}
                            time = {formatTime(data['created'])}
                            memberData={memberData}
                        />
                    )
                })
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal)
                }}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity style={[styles.menu, styles.border]} >
                        <Text style={{...FONTS.body3, textAlign: 'center'}}>Chuy???n ti???p tin nh???n</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menu, styles.border]}>
                        <Text style={{...FONTS.body3, textAlign: 'center'}}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menu, styles.border]}>
                        <Text style={{...FONTS.body3, textAlign: 'center'}}>X??a tin nh???n</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu} onPress={() => setModal(false)}>
                        <Text style={{...FONTS.body3, textAlign: 'center'}}>H???y</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default ChatPanel

const styles = StyleSheet.create({
    menu: { 
        width: '100%', 
        paddingVertical: 20,
    },
    border: {  
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1
    },
    modalView: {
        backgroundColor: COLORS.white,
        color: COLORS.black,
        borderRadius: 20,
        marginBottom: 35,
        marginLeft: '3%',
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        bottom: 0,
        position: 'absolute',
        width: '95%',
    },
})