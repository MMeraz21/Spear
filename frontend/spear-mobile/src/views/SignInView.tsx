import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

type UserInfo = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

WebBrowser.maybeCompleteAuthSession();

const SignInView: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID,
  });

  useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  const handleGoogleSignIn = async () => {
    const storedUser = await AsyncStorage.getItem("@user");

    if (!storedUser) {
      if (response?.type === "success" && response.authentication?.accessToken) {
        await fetchUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(storedUser));
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{userInfo ? `Welcome, ${userInfo.name}` : "Sign in with Google"}</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInView;
