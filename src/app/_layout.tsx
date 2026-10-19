import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AppProvider, useAppContext } from "../context/app-context";

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemedNavigation />
    </AppProvider>
  );

import {
  Stack,
  usePathname,
  useRootNavigationState,
  useRouter,
} from 'expo-router';
import { useEffect, useRef } from 'react';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();
  const started = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || started.current) return;

    started.current = true;

    // Show Login first when the app opens
    if (pathname === '/') {
      router.replace('/login');
    }
  }, [navigationState?.key, pathname, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

function ThemedNavigation() {
  const { colors, themeMode } = useAppContext();

  return (
    <>
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <Stack>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
