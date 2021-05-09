import React from 'react';
import { View } from 'react-native';
import { useFonts } from "@use-expo/font";
import { NavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase';
import 'firebase/firestore';

import StackNavigator from './src/navigations/navigator';

const customFonts = {
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
  'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
};

const firebaseConfig = {
  apiKey: "AIzaSyB0YynfXBARPbNSWu_u-P7kd3wIFsObHT8",
  authDomain: "chat-cc107.firebaseapp.com",
  projectId: "chat-cc107",
  storageBucket: "chat-cc107.appspot.com",
  messagingSenderId: "953108372681",
  appId: "1:953108372681:web:c668c76213275ed42c0118"
};
export default function App() {
  const [isLoaded] = useFonts(customFonts);
  
  if(firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  if (!isLoaded) {
      return (
        <View></View>
      )
  }

  return (
    <NavigationContainer>
        <StackNavigator/>
    </NavigationContainer>
  );
}

