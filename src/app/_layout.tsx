import {
  Stack,
  usePathname,
  useRootNavigationState,
  useRouter,
} from 'expo-router';
import { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { AppProvider, useAppContext } from '../context/app-context';

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemedStack />
    </AppProvider>
  );
}

function ThemedStack() {
  const router = useRouter();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();
  const started = useRef(false);
  const { colors, themeMode } = useAppContext();

  useEffect(() => {
    if (!navigationState?.key || started.current) return;

    started.current = true;

    if (pathname === '/') {
      router.replace('/login');
    }
  }, [navigationState?.key, pathname, router]);

  return (
    <>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
