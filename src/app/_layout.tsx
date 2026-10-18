import { Stack } from "expo-router";
import { AppProvider } from "../context/app-context";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack />
    </AppProvider>
  );
}
