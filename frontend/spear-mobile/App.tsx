import React, { useState, useEffect } from 'react';
import { Text, Image, TouchableOpacity, View, Alert, StyleSheet, StatusBar, Button} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { IOS_CLIENT_ID, BUNDLE_IDENTIFIER } from '@env';

type UserInfo = {
  id: string;
  email: string;
  name: string;
  picture: string;
};



WebBrowser.maybeCompleteAuthSession();

const App: React.FC = () => {
  const [UserInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID
  })

  const handleSignIn = async () => {
    await promptAsync(); // Call the promptAsync function
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title = "Sign in with Googleeeee" onPress={handleSignIn}/>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});