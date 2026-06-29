import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { Colors } from "../constants/colors";
import InteractionBar from "./InteractionBar";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Poem } from "../api/poems";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

type RootStackParamList = {
  MainTabs: undefined;
  PoemView: { poem: Poem };
};

type PoemViewProps = Partial<
  NativeStackScreenProps<RootStackParamList, "PoemView">
> & {
  poem?: Poem;
};

const PoemView: React.FC<PoemViewProps> = (props) => {
  const poemData = props.route?.params?.poem || props.poem;

  if (!poemData) {
    console.error("PoemView rendered without poem data!");
    return (
      <View>
        <Text>Error loading poem.</Text>
      </View>
    );
  }

  const { title, content, author, likes, id } = poemData;

  const navigation = useNavigation();

  const [currentPage, setCurrentPage] = useState(0);
  const [currLikes, setCurrLikes] = useState(likes);
  const [liked, setLiked] = useState(false);
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    if (userInfo && userInfo.likedPoems) {
      const isLiked = userInfo.likedPoems.some((poem) => poem.id === id);
      setLiked(isLiked);
    }
  }, [userInfo, id]);

  useEffect(() => {
    console.log(`Updated currentPage: ${currentPage} / ${totalPages}`);
  }, [currentPage]);

  const paragraphs = content.split("\n\n");

  const splitParagraph = (paragraph: string) => {
    const lines = paragraph.split("\n");
    const MAX_LINES = 8;

    if (lines.length <= MAX_LINES) return [paragraph];

    const pages = [];
    for (let i = 0; i < lines.length; i += MAX_LINES) {
      pages.push(lines.slice(i, i + MAX_LINES).join("\n"));
    }
    return pages;
  };

  const allPages: string[] = paragraphs.flatMap(splitParagraph);
  const totalPages = allPages.length;

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prevPage) => {
      let newPage = direction === "next" ? prevPage + 1 : prevPage - 1;

      if (newPage < 0) {
        console.warn("Attempted to go below first page");
        return 0; // Prevents going below first page
      }
      if (newPage >= totalPages) {
        console.warn("Attempted to go beyond last page");
        return totalPages - 1; // Prevents exceeding total pages
      }

      console.log(`Page changed to ${newPage}`);
      return newPage;
    });
  };

  const handleLike = async () => {
    if (liked) return;

    try {
      const token = await AsyncStorage.getItem("@authToken");
      const userEmail = await AsyncStorage.getItem("@user");

      if (!token || !userEmail) {
        console.error("No auth token or user info found.");
        return;
      }

      const parsedUser = JSON.parse(userEmail);
      const email = parsedUser?.email || "";

      if (!email) {
        console.error("User email is missing.");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${email}/like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setCurrLikes((prev) => {
          const newLikes = prev + 1;
          // Update user's liked poems with the new like count
          if (userInfo) {
            setUserInfo({
              ...userInfo,
              likedPoems: [
                ...userInfo.likedPoems,
                { id, title, content, author, likes: newLikes },
              ],
            });
          }
          return newLikes;
        });
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking poem:", error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > 100 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 5;

        console.log("Swipe Check", {
          isHorizontalSwipe,
          dx: gestureState.dx, // Check if negative for left swipe
          dy: gestureState.dy,
          vx: gestureState.vx, // Check if it's negative for left swipe
          currentPage,
          totalPages,
        });

        return isHorizontalSwipe;
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log("Pan Released", {
          dx: gestureState.dx,
          vx: gestureState.vx,
          currentPage, // Might be stale
          totalPages,
        });

        const SWIPE_THRESHOLD = 10;
        const SWIPE_VELOCITY_THRESHOLD = 0.05;

        const isSwipeRight =
          gestureState.dx > SWIPE_THRESHOLD &&
          gestureState.vx > SWIPE_VELOCITY_THRESHOLD;
        const isSwipeLeft =
          gestureState.dx < -SWIPE_THRESHOLD &&
          gestureState.vx < -SWIPE_VELOCITY_THRESHOLD;

        // Use a function to ensure state is up to date
        setCurrentPage((prevPage) => {
          if (isSwipeRight && prevPage > 0) {
            return prevPage - 1;
          } else if (isSwipeLeft && prevPage < totalPages - 1) {
            return prevPage + 1;
          }
          return prevPage; // No change if conditions aren't met
        });
      },
    }),
  ).current;

  return (
    <View style={styles.poemContainer} {...panResponder.panHandlers}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
      )}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.poemContentContainer}>
          <Text style={styles.poemContent}>{allPages[currentPage]}</Text>
        </View>

        <Text style={styles.author}>- {author}</Text>

        {totalPages > 1 && (
          <Text style={styles.pageIndicator}>
            Page {currentPage + 1} of {totalPages}
          </Text>
        )}
      </View>
      <InteractionBar
        poemId={id}
        likes={currLikes}
        liked={liked}
        onLike={handleLike}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  poemContainer: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  contentWrapper: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 20,
  },
  poemContentContainer: {
    minHeight: height * 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  poemContent: {
    fontSize: 18,
    color: Colors.dark,
    textAlign: "center",
    width: "90%",
    maxWidth: "90%",
  },
  author: {
    fontSize: 16,
    color: Colors.dark,
    marginTop: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  paginationButton: {
    backgroundColor: Colors.dark,
    padding: 10,
    borderRadius: 5,
  },
  paginationButtonText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 14,
    color: Colors.dark,
  },
});

export default PoemView;
