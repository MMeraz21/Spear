import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomGoogleButton from '../components/CustomGoogleButton';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_LOGO_URL = 'https://developers.google.com/identity/images/g-logo.png';



const SignInView: React.FC<{ onUserInfoReceived: (userInfo: any) => void }> = ({ onUserInfoReceived }) => {
  const [userInfo, setUserInfo] = useState<any | null>(null); // State for user data
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID,
  });

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      const storedUser = await AsyncStorage.getItem('@user');
      if (!storedUser && response?.type === 'success') {
        await fetchUserInfo(response.authentication?.accessToken);
      } else if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
        onUserInfoReceived(parsedUser);
      }
    };
    handleGoogleSignIn();
  }, [response]);

  const fetchUserInfo = async (token: string | null | undefined) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();
      await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
      setUserInfo(userInfo);
      onUserInfoReceived(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUserInfo(null); // Clear state
      Alert.alert('Signed Out', 'You have successfully signed out.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spear</Text>
      {userInfo ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {userInfo.name}</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <CustomGoogleButton onPress={() => promptAsync()}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#FF5252', // Red color for sign-out
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SignInView;
