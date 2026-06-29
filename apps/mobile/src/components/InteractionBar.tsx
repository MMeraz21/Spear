import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type InteractionBarProps = {
  poemId: string;
  likes: number;
  liked: boolean;
  onLike: () => void; // Function to handle like action
};

const InteractionBar = ({
  poemId,
  likes,
  liked,
  onLike,
}: InteractionBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <FontAwesome
          name={liked ? "heart" : "heart-o"}
          size={30}
          color={Colors.primary}
          onPress={onLike}
        />
        <Text style={styles.label}>{likes}</Text>
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
