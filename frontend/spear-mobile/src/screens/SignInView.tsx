import React, { useEffect } from "react";
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
import { useUser } from "../context/UserContext";

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "http://localhost:8080"; // Change for production

const SignInView: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS_CLIENT_ID,
  });

  const { setUserInfo } = useUser(); // ✅ Use context

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@authToken");
        const storedUser = await AsyncStorage.getItem("@user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserInfo(parsedUser); // ✅ Set user in context
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

          const userInfoResponse = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: {
                Authorization: `Bearer ${authentication?.accessToken}`,
              },
            }
          );

          const googleUserInfo = await userInfoResponse.json();
          const idToken = authentication?.idToken;

          const backendResponse = await fetch(
            `${BACKEND_URL}/api/auth/google?idToken=${idToken}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!backendResponse.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const authData = await backendResponse.json();

          await AsyncStorage.setItem("@authToken", authData.token);
          await AsyncStorage.setItem("@user", JSON.stringify(authData.user));

          setUserInfo(authData.user); // ✅ Store user in context
        } catch (error) {
          console.error("Authentication error:", error);
          Alert.alert(
            "Authentication Error",
            "Failed to authenticate with server"
          );
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

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
