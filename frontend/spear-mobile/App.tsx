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
  const [UserInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID
  });

  useEffect(() => {
    handleGoogle();
  }, [response]);

  const handleSignIn = async () => {
    await promptAsync(); // Call the promptAsync function
  };

  const handleGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");

    if(!user){
      if(response?.type === "success" && response.authentication?.accessToken){
        await getUserInfo(response.authentication.accessToken);
      }
    }else{
      setUserInfo(JSON.parse(user));
    }
  };

  const getUserInfo = async (token: string) => {
    if(!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {headers: {Authorization: `Bearer ${token}`},}
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error){
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{UserInfo ? JSON.stringify(UserInfo, null, 2) : "No user info available"}</Text>
      <Button title = "Sign in with Google" onPress={handleSignIn}/>
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