import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { AppProvider, useAppContext } from '../context/app-context';

export default function RootLayout() {
	return (
		<AppProvider>
			<ThemedNavigation />
		</AppProvider>
	);
}

function ThemedNavigation() {
	const { colors, themeMode } = useAppContext();

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
