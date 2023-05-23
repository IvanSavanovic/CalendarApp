/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {Provider} from 'react-redux';

import App from './src/App';
import {name as appName} from './app.json';
import darkTheme from './src/assets/theme/darkTheme';
import lightTheme from './src/assets/theme/lightTheme';
import {store} from './src/redux/store';

export default function Main() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <App />
      </PaperProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
