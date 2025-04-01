import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import ProfileCard from "../components/ProfileCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";
import { useUser } from "../context/UserContext";

const ProfileScreen: React.FC = () => {
  const { userInfo, setUserInfo } = useUser();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (
            parsedUser &&
            typeof parsedUser.id === "string" &&
            typeof parsedUser.email === "string" &&
            typeof parsedUser.name === "string" &&
            typeof parsedUser.picture === "string"
          ) {
            setUserInfo(parsedUser);
          } else {
            console.warn("Invalid user data format:", parsedUser);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@user"); // Clear stored user info
              setUserInfo(null); // Triggers rerender to show SignInView
            } catch (error) {
              console.error("Error signing out:", error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.headerText}>Profile</Text>
        {userInfo && (
          <ProfileCard
            username={userInfo.userName}
            profilePic={userInfo.picture}
            onSignOut={handleSignOut}
          />
        )}
      </View>
      <Text style={styles.text}>Welcome to the Profile Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.secondary2,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start", // Ensures text is left-aligned
  },
  topSection: {
    width: "100%",
    alignItems: "flex-start",
  },
});

export default ProfileScreen;
