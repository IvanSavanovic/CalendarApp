/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {useColorScheme} from 'react-native';

import App from './src/App';
import {name as appName} from './app.json';
import darkTheme from './src/components/theme/darkTheme';
import lightTheme from './src/components/theme/lightTheme';

export default function Main() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
