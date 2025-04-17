import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../constants/colors";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useUser();

  const validateInputs = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your poem");
      return false;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Please enter content for your poem");
      return false;
    }
    if (!userInfo?.id) {
      Alert.alert("Error", "You must be logged in to create a poem");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("@authToken");
      if (!token) {
        Alert.alert(
          "Error",
          "Authentication token not found. Please log in again.",
        );
        return;
      }

      const poemData = {
        title: title.trim(),
        content: content.trim(),
        authorId: userInfo!.id,
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        language,
      };

      const response = await fetch("http://localhost:8080/api/poems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(poemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to upload poem");
      }

      Alert.alert("Success", "Poem uploaded successfully");
      // Clear form
      setTitle("");
      setContent("");
      setTags("");
      setLanguage("English");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setIsLoading(false);
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
        maxLength={100} // Reasonable title length limit
      />

      <TextInput
        style={[styles.input, styles.poemInput]}
        placeholder="Write your poem here..."
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
        maxLength={5000} // Reasonable poem length limit
      />

      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        placeholderTextColor={Colors.secondary3}
        value={tags}
        onChangeText={setTags}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleUpload}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.primary3} />
        ) : (
          <Text style={styles.buttonText}>Upload Poem</Text>
        )}
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.primary3,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateScreen;
