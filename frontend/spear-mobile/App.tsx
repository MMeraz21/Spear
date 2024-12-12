import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import SignInView from './src/views/SignInView';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a type for userInfo
type UserInfo = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Explicitly define the type

  const handleUserInfoReceived = (user: UserInfo) => {
    setUserInfo(user);
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {userInfo.name}!</Text>
          <Text>Your email: {userInfo.email}</Text>
          <Button
            title="remove local store"
            onPress={async () => await AsyncStorage.removeItem("@user")}
          />
        </View>
        
      ) : (
        <SignInView onUserInfoReceived={handleUserInfoReceived} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;

