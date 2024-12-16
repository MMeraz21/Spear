import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Poem } from "../api/poems";
import { Colors } from "../constants/colors";

const { height } = Dimensions.get("window");

type PoemViewProps = {
    title: string,
    content: string,
    author: string
}

const PoemView: React.FC<PoemViewProps> = ({ title, content, author }) => {
    return (
      <View style={styles.poemContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.author}>- {author}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000", // Black background for TikTok-like style
    },
    poemContainer: {
      height: height, // Full screen height for each item
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#000", // Match screen background
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 10,
    },
    content: {
      fontSize: 18,
      color: "#fff",
      textAlign: "center",
    },
    author: {
      fontSize: 16,
      color: "#aaa",
      marginTop: 20,
    },
  });

export default PoemView;