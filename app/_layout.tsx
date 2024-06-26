import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, openDatabaseAsync } from 'expo-sqlite';
import { Suspense, useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { Fallback } from '@/components/Fallback';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DBCreateTable, DBDebugInit } from '@/service/db';

import * as Notifications from 'expo-notifications';
import { checkNotificationAllowed } from '@/service/notification';
import { PaperProvider } from 'react-native-paper';
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontLoaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        DBCreateTable();
        // DBDebugInit();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbLoaded(true);
      }
    }

    initDB();
  }, [])

  useEffect(() => {
    if (fontLoaded && dbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, dbLoaded]);

  useEffect(() => {
    checkNotificationAllowed()
  }, [])

  if (!fontLoaded && !dbLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Suspense fallback={<Fallback />}>
        <SQLiteProvider databaseName='qwikplan.db' useSuspense>
          <PaperProvider>  
            {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
            <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </SQLiteProvider>

      </Suspense>
    </SafeAreaView>
  );
}
