import { Provider } from 'react-redux';
import { store } from './store';

import * as SplashScreen from "expo-splash-screen";

import Navigation from './navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
