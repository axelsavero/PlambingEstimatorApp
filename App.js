import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import AppNavigator from './src/navigation/AppNavigator';

// Abaikan warning deprecation SafeAreaView dari LogBox
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function App() {
  useEffect(() => {
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        console.log('Screen orientation lock error:', e);
      }
    }
    lockLandscape();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" hidden={false} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}