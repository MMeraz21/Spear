import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Colors } from "../constants/colors";
import { Poem, fetchPoems } from "../api/poems"

const HomeView: React.FC = () => {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("doing useeffect!!!")
        const loadPoems = async () => {
          try {
            const data = await fetchPoems();
            setPoems(data);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        loadPoems();
      }, []);

    return (
    <View style={styles.container}>
        <Text style={styles.text}>Welcome to the Home Screen!</Text>
        <FlatList
        data={poems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.poemContainer}>
            <Text style={styles.poemTitle}>{item.title}</Text>
            <Text style={styles.poemAuthor}>By: {item.author}</Text>
            <Text style={styles.poemContent}>{item.content}</Text>
            </View>
        )}
        />
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary2
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  poemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  poemAuthor: {
    fontStyle: "italic",
    color: "#555",
  },
  poemContent: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default HomeView;
