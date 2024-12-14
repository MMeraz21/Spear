import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

interface FloatingButtonProps {
    onPress: () => void; // Explicitly require an onPress function
  }
  
  const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
      <Ionicons name="add" size={40} color="#FFFFFF" /> 
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    floatingButton: {
      position: "absolute",
      bottom: 15, // Adjust as needed
      alignSelf: "center",
      height: 60,
      width: 60,
      borderRadius: 35,
      backgroundColor: Colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
  
  export default FloatingButton;