import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Colors } from "../constants/colors";

const { height, width } = Dimensions.get("window");

type PoemViewProps = {
    title: string,
    content: string,
    author: string
}

const PoemView: React.FC<PoemViewProps> = ({ title, content, author }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Split content into paragraphs first
  const paragraphs = content.split('\n\n');

  // Function to calculate if a paragraph needs to be split
  const splitParagraph = (paragraph: string) => {
    const lines = paragraph.split('\n');
    const MAX_LINES = 8; // Adjust based on your screen size and design

    if (lines.length <= MAX_LINES) return [paragraph];

    const pages = [];
    for (let i = 0; i < lines.length; i += MAX_LINES) {
      pages.push(lines.slice(i, i + MAX_LINES).join('\n'));
    }
    return pages;
  };

  const allPages: string[] = paragraphs.flatMap(splitParagraph);
  const totalPages = allPages.length;

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <View style={styles.poemContainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.poemContentContainer}>
          <Text style={styles.poemContent}>
            {allPages[currentPage]}
          </Text>
        </View>

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            {currentPage > 0 && (
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageChange('prev')}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {currentPage < totalPages - 1 && (
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageChange('next')}
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.author}>- {author}</Text>

        {totalPages > 1 && (
          <Text style={styles.pageIndicator}>
            Page {currentPage + 1} of {totalPages}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  poemContainer: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  contentWrapper: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  poemContentContainer: {
    minHeight: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  poemContent: {
    fontSize: 18,
    color: Colors.dark,
    textAlign: 'center',
    width: '90%',
    maxWidth: '90%',
  },
  author: {
    fontSize: 16,
    color: Colors.dark,
    marginTop: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  }
});

export default PoemView;
