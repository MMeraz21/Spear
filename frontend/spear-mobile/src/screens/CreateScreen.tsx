import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { Colors } from "../constants/colors";

const CreateScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("English");

  const handleUpload = async () => {
    if (!title || !content || !authorId) {
      Alert.alert("Error", "Please fill in all required fields");
    }

    const poemData = {
      title,
      content,
      authorId,
      tags: tags.split(",").map((tag) => tag.trim()),
      language,
    };

    console.log(poemData);

    try {
      const response = await fetch("http://localhost:8080/api/poems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poemData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload poem");
      }

      Alert.alert("Success", "Poem uploaded successfully");
      setTitle("");
      setContent("");
      setAuthorId("");
      setTags("");
      setLanguage("English");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Upload Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Poem</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.poemInput]}
        placeholder="Write your poem here..."
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor="#aaa"
        value={authorId}
        onChangeText={setAuthorId}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        placeholderTextColor={Colors.secondary3}
        value={tags}
        onChangeText={setTags}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload Poem</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary3,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.secondary3,
  },
  poemInput: {
    height: 250,
    textAlignVertical: "top",
    borderColor: Colors.secondary3,
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderColor: Colors.primary3,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.primary3,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateScreen;
