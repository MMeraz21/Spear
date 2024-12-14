import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native';
import SignInView from './src/screens/SignInView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { loadFonts } from './src/theme/fonts';
import { Ionicons } from "@expo/vector-icons"; // Icon library
import HomeView from './src/screens/HomeView';
import { Colors } from './src/constants/colors';
import ProfileScreen from './src/screens/ProfileScreen';
import CreateScreen from './src/screens/CreateScreen';
import FloatingButton from './src/components/FloatingButton';


// Define a type for userInfo
type UserInfo = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

type BottomTabParamList = {
  Home: undefined;      
  Profile: undefined;   
  Settings: undefined;  
  Create: undefined; 
};

const Tab = createBottomTabNavigator<BottomTabParamList>();


const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Explicitly define the type
  const[fontsLoaded, setFontsLoaded] = useState(false);

  const handleUserInfoReceived = (user: UserInfo) => {
    setUserInfo(user);
  };

  useEffect(() => {
    const loadAppFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false, // Hide the header if not needed
              tabBarActiveTintColor: Colors.primary, // Active tab color
              tabBarInactiveTintColor: "#808080", // Inactive tab color
              tabBarStyle: { backgroundColor: "#FFFFFF" }, // Style of the tab bar
              tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                switch (route.name) {
                  case "Home":
                    iconName = "home-outline";
                    break;
                  case "Profile":
                    iconName = "person-outline";
                    break;
                  default:
                    iconName = "help-circle-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            {/* Define screens for bottom tabs */}
            <Tab.Screen name="Home" component={HomeView} />
            <Tab.Screen
              name="Create"
              component={CreateScreen} // Replace with your "Create" screen
              options={{
                tabBarButton: (props) => (
                  <FloatingButton navigateTo="Create" /> 
                ),
              }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
      </NavigationContainer>
        
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

