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
    poemContainer: {
        height: height,
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: Colors.secondary, 
    },
    title: {
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: Colors.dark,
      marginBottom: 10,
      flexWrap: "wrap",
      width: "90%"
    },
    content: {
      fontSize: 18,
      color: Colors.dark,
      textAlign: "center",
      maxWidth: '90%'
    },
    author: {
      fontSize: 16,
      color: Colors.dark,
      marginTop: 20,
    },
  });

export default PoemView;