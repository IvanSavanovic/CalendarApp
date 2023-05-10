import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import MyCalendar from './components/calendar/MyCalendar';

const App = (): JSX.Element => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeView, {backgroundColor: theme.colors.background}]}>
      <MyCalendar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {flex: 1, justifyContent: 'center'},
});

export default App;
