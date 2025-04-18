import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Poem } from "../api/poems";
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  PoemView: { poem: Poem };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PoemCardProps = {
  poem: Poem;
};

const PoemCard: React.FC<PoemCardProps> = ({ poem }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("PoemView", { poem });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {poem.title}
        </Text>
        <Text style={styles.preview} numberOfLines={3}>
          {poem.content.split("\n")[0]}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.author}>- {poem.author}</Text>
          <View style={styles.likesContainer}>
            <Text style={styles.likes}>{poem.likes} likes</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 8,
  },
  preview: {
    fontSize: 16,
    color: Colors.dark,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: Colors.dark,
    opacity: 0.7,
  },
  likesContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likes: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
});

export default PoemCard;
