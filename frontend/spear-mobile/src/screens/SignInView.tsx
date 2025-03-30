import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomGoogleButton from "../components/CustomGoogleButton";
import { Colors } from "../constants/colors";

type SignInViewProps = {
  onUserInfoReceived: (user: any) => void; // Adjust the type of 'user' if you have a defined user type
};

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "http://localhost:8080";

const SignInView: React.FC<SignInViewProps> = ({ onUserInfoReceived }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID,
  });

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@authToken");
        const storedUser = await AsyncStorage.getItem("@user");

        if (storedToken && storedUser) {
          // User already logged in
          const parsedUser = JSON.parse(storedUser);
          setUserInfo(parsedUser);
          onUserInfoReceived(parsedUser);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    checkExistingAuth();
  }, []);

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success") {
        try {
          const { authentication } = response;
          // Get user info from Google
          const userInfoResponse = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: {
                Authorization: `Bearer ${authentication?.accessToken}`,
              },
            },
          );

          const googleUserInfo = await userInfoResponse.json();

          // Get ID token - this is what your backend expects
          const idToken = authentication?.idToken;
          console.log("ID Token:", idToken);
          // Send ID token to your backend
          const backendResponse = await fetch(
            `${BACKEND_URL}/api/auth/google?idToken=${idToken}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!backendResponse.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const authData = await backendResponse.json();

          // Store the JWT token from your backend
          await AsyncStorage.setItem("@authToken", authData.token);

          // Store user info
          await AsyncStorage.setItem("@user", JSON.stringify(authData.user));

          // Update state and pass to parent
          setUserInfo(authData.user);
          onUserInfoReceived(authData.user);

          console.log("Successfully authenticated with backend");
        } catch (error) {
          console.error("Authentication error:", error);
          Alert.alert(
            "Authentication Error",
            "Failed to authenticate with server",
          );
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@authToken");
      setUserInfo(null);
      Alert.alert("Signed Out", "You have successfully signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.container1}>
        <Text style={styles.title}>Spear</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/SpearLogo.png")}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  container1: {
    backgroundColor: Colors.secondary,
    width: "100%",
    height: hp("45%"),
    borderBottomLeftRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.primary3,
    textAlign: "left",
    marginBottom: 40,
    fontFamily: "NimbusSansL-Bold",
    alignSelf: "flex-start",
  },
  image: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 40,
    padding: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 132,
  },
});

export default SignInView;
