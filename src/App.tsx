import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MyCalendar from './components/calendar/MyCalendar';

function App(): JSX.Element {
  //const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.safeView}>
      <MyCalendar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {flex: 1, justifyContent: 'center'},
});

export default App;
