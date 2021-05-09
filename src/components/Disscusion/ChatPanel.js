import React, {useState} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FONTS } from '../../constants';
import {dataMessageConst} from '../../data';

import Received from './Received';
import Sent from './Sent';

const ChatPanel = ({itemPic, dataMessage, uid}) => {
    return(
        <ScrollView showsVerticalScrollIndicator={false} style={{height: '95%'}}>
            {
                dataMessageConst.map((data, index) => {
                    if(index % 2 == 0) return (
                        <Sent
                            key={index}
                            message={data}
                            create={data['create']}
                        />
                    ) 
                    else return (
                        <Received 
                            key={index}
                            image={itemPic}
                            message={data}
                            create={data['create']}
                        />
                    )
                })
            }
        </ScrollView>
    )
}

export default ChatPanel