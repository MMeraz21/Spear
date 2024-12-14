import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';  
import CustomGoogleButton from '../components/CustomGoogleButton';
import { Colors } from '../constants/colors';

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
      {/* Top Section */}
      <View style={styles.container1}>
        <Text style={styles.title}>Spear</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/SpearLogo.png')}
            style={styles.image}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.buttonContainer}>
        <CustomGoogleButton onPress={() => promptAsync()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.primary,
        justifyContent: 'space-between', 
        alignItems: 'center', 
      },
      container1: {
        backgroundColor: Colors.secondary,
        width: '100%', 
        height: hp('45%'), 
        borderBottomLeftRadius: 100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute', 
        top: 0, 
      },
      title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.primary3,
        textAlign: 'center',
        marginBottom: 10, 
        fontFamily: 'NimbusSansL-Bold',
      },
      image: {
        height: 80,
        width: 80,
        resizeMode: 'contain', 
      },
      imageContainer: {
        backgroundColor: 'white',
        borderRadius: 40, 
        padding: 10, 
        overflow: 'hidden', 
      },
      buttonContainer: {
        flex: 1, 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        marginBottom: 90, 
      },
});

export default SignInView;
