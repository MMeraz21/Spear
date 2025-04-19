import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import { Colors } from "../constants/colors";
import { Poem, fetchPoems } from "../api/poems";
import PoemView from "../components/PoemView";

const { height } = Dimensions.get("window");

const HomeView: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("doing useeffect!!!");
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

  const renderPoem = ({ item }: { item: Poem }) => <PoemView poem={item} />;

  return (
    <View>
      <FlatList
        data={poems}
        renderItem={renderPoem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={styles.container}
        snapToInterval={height}
        decelerationRate="fast"
        // contentContainerStyle={{ flexGrow: 1 }} // Ensures full height is used
        // snapToAlignment="start" // Aligns each item at the start
        // decelerationRate="fast" // Fast swiping experience
      />
    </View>
  );
};
//ede

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeView;
