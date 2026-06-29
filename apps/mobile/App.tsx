import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import SignInView from "./src/screens/SignInView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { loadFonts } from "./src/theme/fonts";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import HomeView from "./src/screens/HomeView";
import { Colors } from "./src/constants/colors";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateScreen from "./src/screens/CreateScreen";
import FloatingButton from "./src/components/FloatingButton";
import { UserProvider, useUser } from "./src/context/UserContext";
import { Poem } from "./src/api/poems";
import PoemView from "./src/components/PoemView";

type UserInfo = {
  id: string;
  email: string;
  userName: string;
  picture: string;
  oauthProvider: string;
  oauthProviderId: string;
  likes: Poem[];
} | null;

// Define ParamList for the Root Stack
type RootStackParamList = {
  MainTabs: undefined; // Represents the Bottom Tab Navigator
  PoemView: { poem: Poem };
};

// Define ParamList for the Bottom Tabs
type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Create: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>(); // Create Stack Navigator instance

// Component for the Bottom Tab Navigator
const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: "#808080",
      tabBarStyle: { backgroundColor: "#FFFFFF" },
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
    <Tab.Screen name="Home" component={HomeView} />
    <Tab.Screen
      name="Create"
      component={CreateScreen}
      options={{
        tabBarButton: (props) => <FloatingButton navigateTo="Create" />,
      }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainApp: React.FC = () => {
  const { userInfo } = useUser(); // Removed setUserInfo as it's not used here
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
          {/* Use Stack Navigator as the root */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="PoemView" component={PoemView} />
            {/* You might want a header for PoemView */}
            {/* <Stack.Screen name="PoemView" component={PoemView} options={{ headerShown: true, title: 'Poem' }} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <SignInView />
      )}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default App;
