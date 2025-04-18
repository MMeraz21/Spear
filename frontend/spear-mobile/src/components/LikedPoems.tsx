import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Poem } from "../api/poems";
import PoemCard from "./PoemCard";
import { Colors } from "../constants/colors";

type LikedPoemsProps = {
  poemList?: Poem[];
};

const LikedPoems: React.FC<LikedPoemsProps> = ({ poemList = [] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Liked Poems</Text>
        <FlatList
          data={poemList}
          renderItem={({ item }) => <PoemCard poem={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary2,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    marginBottom: 20,
    paddingRight: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default LikedPoems;
