import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

const CustomGoogleButton: React.FC<{ 
  onPress: () => void, 
  style?: 'dark' | 'light', 
  disabled?: boolean 
}> = ({ 
  onPress, 
  style = 'dark', 
  disabled = false 
}) => {
  const buttonStyle = style === 'dark' ? styles.darkButton : styles.lightButton;
  const textStyle = style === 'dark' ? styles.darkButtonText : styles.lightButtonText;

  return (
    <TouchableOpacity 
      style={[
        styles.baseButton, 
        buttonStyle, 
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        <View style={[
          styles.logoContainer, 
          disabled && styles.disabledLogoContainer
        ]}>
          <Image 
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }} 
            style={styles.googleLogo} 
          />
        </View>
        <Text style={[
          styles.buttonText, 
          textStyle, 
          disabled && styles.disabledButtonText
        ]}>
          Sign in with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 50,
    width: 240,
    borderRadius: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    // Web-like transition is tricky in React Native
  },
  darkButton: {
    backgroundColor: '#4285f4',
  },
  lightButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    position: 'absolute',
    left: 1,
    top: 1,
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLogo: {
    width: 18,
    height: 18,
  },
  buttonText: {
    fontFamily: Platform.select({
      ios: 'Arial',
      android: 'Roboto',
      default: 'Roboto, arial, sans-serif'
    }),
    fontSize: 16,
    lineHeight: 48,
    marginLeft: 48,
  },
  darkButtonText: {
    color: '#fff',
  },
  lightButtonText: {
    color: 'rgba(0,0,0,0.54)',
  },
  disabledButton: {
    backgroundColor: 'rgba(37, 5, 5, 0.08)',
  },
  disabledButtonText: {
    color: 'rgba(0, 0, 0, 0.40)',
  },
  disabledLogoContainer: {
    backgroundColor: 'transparent',
  },
});

export default CustomGoogleButton;