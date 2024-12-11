import React from 'react';
import { StyleSheet, View } from 'react-native';
import SignInView from './src/views/SignInView';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <SignInView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
