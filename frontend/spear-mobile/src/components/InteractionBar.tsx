import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

const InteractionBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <FontAwesome name="heart-o" size={30} color={Colors.primary} />
        <Text style={styles.label}>123</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="comment-o" size={30} color={Colors.primary} />
        <Text style={styles.label}>45</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="share-square-o" size={30} color={Colors.primary} />
        <Text style={styles.label}>10</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 120,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 5,
  },
});

export default InteractionBar;
