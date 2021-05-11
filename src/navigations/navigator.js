import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from './bottomTabNavigator';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Disscusion from '../screens/Disscusion';
import ChatboxSetting from '../screens/ChatboxSetting';
import CreateGroupChat from '../screens/CreateGroupChat';
import AddMember from '../screens/AddMember';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'Home'}
        >
            <Stack.Screen name="Home"  component={BottomTabNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Disscusion" component={Disscusion} />
            <Stack.Screen name="ChatboxSetting" component={ChatboxSetting} />
            <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
            <Stack.Screen name="AddMember" component={AddMember} />
        </Stack.Navigator>
    )
}

export default StackNavigator;