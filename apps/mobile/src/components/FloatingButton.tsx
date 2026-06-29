import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


type BottomTabParamList = {
    Home: undefined;      
    Profile: undefined;   
    Settings: undefined;  
    Create: undefined; 
  };

type NavigationProp = BottomTabNavigationProp<BottomTabParamList>;

interface FloatingButtonProps {
    navigateTo: keyof BottomTabParamList; 
  }
  
  const FloatingButton: React.FC<FloatingButtonProps> = ({ navigateTo }) => {
    const navigation = useNavigation<NavigationProp>();

    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate(navigateTo)} 
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