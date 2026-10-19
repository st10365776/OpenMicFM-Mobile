import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

export type ThemeMode = 'dark' | 'light';

export type AppColors = {
	background: string;
	surface: string;
	surfaceAlt: string;
	border: string;
	text: string;
	muted: string;
	subtle: string;
	red: string;
	redDark: string;
	yellow: string;
	black: string;
	white: string;
};

export type ListenerProfile = {
	fullName?: string;
	email?: string;
	[key: string]: unknown;
};

type AppContextValue = {
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	colors: AppColors;
	user: ListenerProfile | null;
	token: string | null;
	signIn: (token: string, user: ListenerProfile) => void;
	signOut: () => void;
};

const darkColors: AppColors = {
	background: '#000000',
	surface: '#151515',
	surfaceAlt: '#1E1E1E',
	border: '#292929',
	text: '#FFFFFF',
	muted: '#929292',
	subtle: '#555555',
	red: '#D71920',
	redDark: '#A80F15',
	yellow: '#FFD200',
	black: '#000000',
	white: '#FFFFFF',
};

const lightColors: AppColors = {
	background: '#FFFFFF',
	surface: '#F4F4F4',
	surfaceAlt: '#E9E9E9',
	border: '#D6D6D6',
	text: '#111111',
	muted: '#626262',
	subtle: '#777777',
	red: '#D71920',
	redDark: '#A80F15',
	yellow: '#FFD200',
	black: '#000000',
	white: '#FFFFFF',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
	const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
	const [user, setUser] = useState<ListenerProfile | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const value = useMemo<AppContextValue>(
		() => ({
			themeMode,
			setThemeMode,
			colors: themeMode === 'dark' ? darkColors : lightColors,
			user,
			token,
			signIn: (nextToken, nextUser) => {
				setToken(nextToken);
				setUser(nextUser);
			},
			signOut: () => {
				setToken(null);
				setUser(null);
			},
		}),
		[themeMode, user, token]
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within AppProvider.');
	}
	return context;
}

type AppStyle = ViewStyle | TextStyle | ImageStyle;

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(baseStyles: T): T {
	const { colors, themeMode } = useAppContext();

	return useMemo(() => {
		const themedStyles: Record<string, AppStyle> = {};

		for (const [name, registeredStyle] of Object.entries(baseStyles)) {
			const style = StyleSheet.flatten(
				registeredStyle as AppStyle
			) as Record<string, unknown>;
			const themed: Record<string, unknown> = { ...style };

			for (const [property, value] of Object.entries(style)) {
				if (typeof value !== 'string') continue;
				const normalized = value.toUpperCase();

				if (property === 'color') {
					if (normalized === '#D71920') {
						themed[property] = colors.red;
					} else if (normalized === '#A80F15') {
						themed[property] = colors.redDark;
					} else if (normalized === '#FFD200') {
						themed[property] = colors.yellow;
					} else if (normalized === '#FFFFFF') {
						themed[property] =
							/(buttonText|retryText|submitText|logoText|avatarText|loadingLogoText|placeholderText|placeholderMark|badgeText|countText|chipTextActive|categoryTextActive|newsBadgeText|allButtonText|allShowsText|readStory)/i.test(
								name
							)
								? colors.white
								: colors.text;
					} else if (normalized === '#929292' || normalized === '#626262') {
						themed[property] = colors.muted;
					} else if (
						normalized === '#555555' ||
						normalized === '#666666' ||
						normalized === '#777777'
					) {
						themed[property] = colors.subtle;
					} else if (normalized === '#000000' || normalized === '#111111') {
						themed[property] = themeMode === 'dark' ? colors.black : colors.text;
					}
				} else if (property.startsWith('backgroundColor')) {
					if (normalized === '#000000' || normalized === '#0D0D0D') {
						themed[property] = colors.background;
					} else if (normalized === '#151515') {
						themed[property] = colors.surface;
					} else if (normalized === '#1E1E1E') {
						themed[property] = colors.surfaceAlt;
					} else if (normalized === '#FFFFFF') {
						themed[property] = themeMode === 'dark' ? colors.white : colors.surface;
					} else if (normalized === '#F4F4F4') {
						themed[property] = colors.surface;
					} else if (normalized === '#E9E9E9') {
						themed[property] = colors.surfaceAlt;
					} else if (normalized === '#241010') {
						themed[property] =
							themeMode === 'dark' ? normalized : colors.surfaceAlt;
					} else if (normalized === '#D71920' || normalized === '#A80F15') {
						themed[property] =
							normalized === '#A80F15' ? colors.redDark : colors.red;
					} else if (normalized === '#FFD200') {
						themed[property] = colors.yellow;
					}
				} else if (
					property.toLowerCase().includes('border') &&
					(normalized === '#292929' || normalized === '#D6D6D6')
				) {
					themed[property] = colors.border;
				}
			}

			themedStyles[name] = themed as AppStyle;
		}

		return themedStyles as T;
	}, [baseStyles, colors, themeMode]);
}
