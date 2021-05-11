import React, {useState} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FONTS } from '../../constants';
import {dataMessageConst} from '../../data';

import Received from './Received';
import Sent from './Sent';

const ChatPanel = ({dataMessage, uidLogin}) => {
    return(
        <ScrollView showsVerticalScrollIndicator={false} style={{height: '95%'}}>
            {dataMessage && 
                dataMessage.map((data, index) => {
                    if(uidLogin == data['owner']) return (
                        <Sent
                            key={index}
                            message={data['content']}
                            create={data['create']}
                        />
                    ) 
                    else return (
                        <Received 
                            key={index}
                            message={data['content']}
                            create={'abc'}
                            owner={data['owner']}
                        />
                    )
                })
            }
        </ScrollView>
    )
}

export default ChatPanel