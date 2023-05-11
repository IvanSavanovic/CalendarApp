import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import Home from './components/home/Home';

const App = (): JSX.Element => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeView, {backgroundColor: theme.colors.background}]}>
      <Home />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {flex: 1, justifyContent: 'center'},
});

export default App;
