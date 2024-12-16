import React, { useState, useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Dimensions,
  } from "react-native";
import { Colors } from "../constants/colors";
import { Poem, fetchPoems } from "../api/poems"
import PoemView from "../components/PoemView";

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
        {/* <Text style={styles.text}>Welcome to the Home Screen!</Text> */}
        <FlatList
            data={poems}
            renderItem={({ item }) => (
            <PoemView title={item.title} content={item.content} author={item.author} />
            )}
            keyExtractor={(item) => item.id.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={true}
            style={styles.container}
        />
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
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
