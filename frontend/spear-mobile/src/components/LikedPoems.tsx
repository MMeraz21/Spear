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
      <Text style={styles.header}>Liked Poems</Text>
      <FlatList
        data={poemList}
        renderItem={({ item }) => <PoemCard poem={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default LikedPoems;
