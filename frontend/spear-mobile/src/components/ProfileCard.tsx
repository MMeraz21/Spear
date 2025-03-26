import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

type ProfileCardProps = {
  username: string;
  profilePic?: string;
  onSignOut: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  profilePic,
  onSignOut,
}) => {
  return (
    <View style={styles.card}>
      <Image
        source={
          profilePic ? { uri: profilePic } : require("../assets/SpearLogo.png")
        }
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Welcome, {username}!</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: Colors.primary,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.dark,
  },
  signOutButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileCard;
