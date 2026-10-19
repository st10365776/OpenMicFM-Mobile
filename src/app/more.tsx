import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/app-context';

const audioQualities = ['Low', 'Standard', 'High'] as const;

export default function MoreScreen() {
	const router = useRouter();
	const { themeMode, setThemeMode, colors, user, signOut } = useAppContext();
	const [audioQuality, setAudioQuality] = useState<(typeof audioQualities)[number]>('Standard');
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacyExpanded, setPrivacyExpanded] = useState(false);

	const isDark = themeMode === 'dark';
	const divider = colors.border;
	const heading = colors.text;
	const label = colors.muted;
	const hint = colors.subtle;
	const chevron = colors.muted;

	const showAudioQualityOptions = () => {
		Alert.alert('Audio quality', 'Choose your preferred playback quality.', [
			...audioQualities.map((quality) => ({
				text: quality,
				onPress: () => setAudioQuality(quality),
			})),
			{ text: 'Cancel', style: 'cancel' },
		]);
	};

	const confirmSignOut = () => {
		Alert.alert('Sign out', 'Are you sure you want to sign out?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Sign out',
				style: 'destructive',
				onPress: () => {
					signOut();
					router.replace('/');
				},
			},
		]);
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
			<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={[styles.eyebrow, { color: colors.red }]}>OPENMICFM</Text>
				<Text style={[styles.heading, { color: heading }]}>More</Text>

				<Text style={[styles.sectionLabel, { color: label }]}>YOUR PROFILE</Text>
				<Pressable
					style={({ pressed }) => [
						styles.profileCard,
						{ backgroundColor: colors.surface, borderColor: colors.border },
						pressed && styles.pressed,
					]}
					accessibilityRole="button"
					accessibilityLabel={user ? 'View your profile' : 'Sign in or create an account'}
					onPress={() => router.push('/profile' as never)}
				>
					<View style={[styles.avatar, { backgroundColor: colors.red }]}>
						<Text style={styles.avatarText}>OM</Text>
					</View>
					<View style={styles.profileCopy}>
						<Text style={[styles.profileName, { color: heading }]}>
							{user?.fullName || (user ? 'Your profile' : 'Sign in or register')}
						</Text>
						<Text style={[styles.profileDetail, { color: colors.muted }]}>
							{user?.email || 'View your account details'}
						</Text>
					</View>
					<Text style={[styles.chevron, { color: chevron }]}>›</Text>
				</Pressable>

				<View style={styles.sectionHeadingRow}>
					<Text style={[styles.sectionLabel, { color: label }]}>SETTINGS</Text>
					<Text style={[styles.sectionHint, { color: hint }]}>Make it yours</Text>
				</View>

				<View
					style={[
						styles.settingsCard,
						{ backgroundColor: colors.surface, borderColor: colors.border },
					]}
				>
					<View style={[styles.appearanceRow, styles.divider, { borderBottomColor: divider }]}>
						<View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
							<Text style={[styles.iconText, { color: colors.red }]}>◐</Text>
						</View>
						<View style={styles.settingCopy}>
							<Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
							<Text style={[styles.settingDetail, { color: label }]}>
								Choose light or dark mode
							</Text>
						</View>
						<View
							style={[styles.modePicker, { backgroundColor: colors.surfaceAlt }]}
							accessibilityRole="radiogroup"
							accessibilityLabel="Appearance mode"
						>
							{(['light', 'dark'] as const).map((mode) => {
								const selected = themeMode === mode;
								return (
									<Pressable
										key={mode}
										style={[
											styles.modeButton,
											selected && styles.selectedModeButton,
											selected && { backgroundColor: colors.yellow },
										]}
										onPress={() => setThemeMode(mode)}
										accessibilityRole="radio"
										accessibilityState={{ selected }}
										accessibilityLabel={`${mode} mode`}
									>
										<Text
											style={[
												styles.modeButtonText,
												{ color: selected ? colors.black : colors.muted },
											]}
										>
											{mode === 'light' ? 'Light' : 'Dark'}
										</Text>
									</Pressable>
								);
							})}
						</View>
					</View>

					<Pressable
						style={({ pressed }) => [
							styles.settingRow,
							styles.divider,
							{ borderBottomColor: divider },
							pressed && styles.pressed,
						]}
						onPress={showAudioQualityOptions}
						accessibilityRole="button"
						accessibilityLabel={`Audio and playback. Quality ${audioQuality}`}
					>
						<View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
							<Text style={[styles.iconText, { color: colors.red }]}>♪</Text>
						</View>
						<View style={styles.settingCopy}>
							<Text style={[styles.settingTitle, { color: colors.text }]}>Audio & playback</Text>
							<Text style={[styles.settingDetail, { color: label }]}>
								Playback quality: {audioQuality}
							</Text>
						</View>
						<Text style={[styles.chevron, { color: chevron }]}>›</Text>
					</Pressable>

					<Pressable
						style={({ pressed }) => [
							styles.settingRow,
							styles.divider,
							{ borderBottomColor: divider },
							pressed && styles.pressed,
						]}
						onPress={() => setNotificationsEnabled((enabled) => !enabled)}
						accessibilityRole="switch"
						accessibilityState={{ checked: notificationsEnabled }}
						accessibilityLabel="Notifications"
					>
						<View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
							<Text style={[styles.iconText, { color: colors.red }]}>◉</Text>
						</View>
						<View style={styles.settingCopy}>
							<Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
							<Text style={[styles.settingDetail, { color: label }]}>
								{notificationsEnabled ? 'Notifications are on' : 'Notifications are off'}
							</Text>
						</View>
						<View
							style={[
								styles.toggleTrack,
								notificationsEnabled ? [styles.toggleOn, { backgroundColor: colors.red }] : { backgroundColor: colors.surfaceAlt },
							]}
						>
							<View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbOn]} />
						</View>
					</Pressable>

					<Pressable
						style={({ pressed }) => [
							styles.settingRow,
							!privacyExpanded && styles.divider,
							!privacyExpanded && { borderBottomColor: divider },
							pressed && styles.pressed,
						]}
						onPress={() => setPrivacyExpanded((expanded) => !expanded)}
						accessibilityRole="button"
						accessibilityState={{ expanded: privacyExpanded }}
					>
						<View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
							<Text style={[styles.iconText, { color: colors.red }]}>⌑</Text>
						</View>
						<View style={styles.settingCopy}>
							<Text style={[styles.settingTitle, { color: colors.text }]}>Privacy & security</Text>
							<Text style={[styles.settingDetail, { color: label }]}>
								Your account and preferences
							</Text>
						</View>
						<Text style={[styles.chevron, { color: chevron }]}>
							{privacyExpanded ? '⌄' : '›'}
						</Text>
					</Pressable>
					{privacyExpanded && (
						<View style={[styles.privacyDetail, { borderBottomColor: divider }]}>
							<Text style={[styles.privacyText, { color: colors.muted }]}>
								Your account details and preferences are managed securely. Sign in to review
								your account settings.
							</Text>
							<Pressable
								onPress={() => router.push('/login' as never)}
								accessibilityRole="button"
								style={({ pressed }) => pressed && styles.pressed}
							>
								<Text style={[styles.privacyAction, { color: colors.red }]}>SIGN IN</Text>
							</Pressable>
						</View>
					)}

					<Pressable
						style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
						onPress={() =>
							Alert.alert(
								'Help & support',
								'For help with OpenMicFM, contact the station through its official support channels.'
							)
						}
						accessibilityRole="button"
					>
						<View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
							<Text style={[styles.iconText, { color: colors.red }]}>?</Text>
						</View>
						<View style={styles.settingCopy}>
							<Text style={[styles.settingTitle, { color: colors.text }]}>Help & support</Text>
							<Text style={[styles.settingDetail, { color: label }]}>
								Get help with OpenMicFM
							</Text>
						</View>
						<Text style={[styles.chevron, { color: chevron }]}>›</Text>
					</Pressable>
				</View>

				{user ? (
					<Pressable
						style={({ pressed }) => [
							styles.signOutButton,
							{ borderColor: colors.red },
							pressed && styles.pressed,
						]}
						onPress={confirmSignOut}
						accessibilityRole="button"
					>
						<Text style={[styles.signOutText, { color: colors.red }]}>SIGN OUT</Text>
					</Pressable>
				) : (
					<Pressable
						style={({ pressed }) => [
							styles.signOutButton,
							{ borderColor: colors.red },
							pressed && styles.pressed,
						]}
						onPress={() => router.push('/login' as never)}
						accessibilityRole="button"
					>
						<Text style={[styles.signOutText, { color: colors.red }]}>SIGN IN</Text>
					</Pressable>
				)}
				<Text style={[styles.version, { color: hint }]}>OPENMICFM  ·  VERSION 1.0.0</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	content: {
		paddingHorizontal: 22,
		paddingTop: 20,
		paddingBottom: 36,
	},
	eyebrow: {
		color: '#D71920',
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 2.2,
		marginBottom: 8,
	},
	heading: {
		fontSize: 32,
		fontWeight: '800',
		letterSpacing: -0.7,
		marginBottom: 30,
	},
	sectionLabel: {
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 1.5,
		marginBottom: 12,
	},
	profileCard: {
		alignItems: 'center',
		borderRadius: 18,
		borderWidth: 1,
		flexDirection: 'row',
		marginBottom: 30,
		padding: 16,
	},
	avatar: {
		alignItems: 'center',
		backgroundColor: '#D71920',
		borderRadius: 24,
		height: 48,
		justifyContent: 'center',
		width: 48,
	},
	avatarText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '900',
	},
	profileCopy: {
		flex: 1,
		marginLeft: 13,
	},
	profileName: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4,
	},
	profileDetail: {
		fontSize: 12,
	},
	sectionHeadingRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	sectionHint: {
		fontSize: 12,
		marginBottom: 12,
	},
	settingsCard: {
		borderRadius: 18,
		borderWidth: 1,
		overflow: 'hidden',
	},
	appearanceRow: {
		alignItems: 'center',
		flexDirection: 'row',
		minHeight: 76,
		paddingHorizontal: 14,
	},
	settingRow: {
		alignItems: 'center',
		flexDirection: 'row',
		minHeight: 76,
		paddingHorizontal: 14,
	},
	divider: {
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	iconBox: {
		alignItems: 'center',
		borderRadius: 12,
		height: 40,
		justifyContent: 'center',
		width: 40,
	},
	iconText: {
		color: '#D71920',
		fontSize: 18,
		fontWeight: '700',
	},
	settingCopy: {
		flex: 1,
		marginLeft: 12,
	},
	settingTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 4,
	},
	settingDetail: {
		fontSize: 11,
	},
	chevron: {
		fontSize: 27,
		fontWeight: '300',
		marginLeft: 8,
	},
	modePicker: {
		borderRadius: 12,
		flexDirection: 'row',
		padding: 3,
	},
	modeButton: {
		alignItems: 'center',
		borderRadius: 9,
		justifyContent: 'center',
		minWidth: 48,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	selectedModeButton: {
		elevation: 1,
	},
	modeButtonText: {
		fontSize: 11,
		fontWeight: '700',
	},
	toggleTrack: {
		borderRadius: 12,
		height: 24,
		justifyContent: 'center',
		paddingHorizontal: 3,
		width: 42,
	},
	toggleOn: {
		backgroundColor: '#D71920',
	},
	toggleThumb: {
		backgroundColor: '#FFFFFF',
		borderRadius: 9,
		height: 18,
		width: 18,
	},
	toggleThumbOn: {
		alignSelf: 'flex-end',
	},
	privacyDetail: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingBottom: 16,
		paddingHorizontal: 66,
	},
	privacyText: {
		fontSize: 12,
		lineHeight: 18,
		marginBottom: 12,
	},
	privacyAction: {
		color: '#D71920',
		fontSize: 11,
		fontWeight: '800',
		letterSpacing: 0.8,
	},
	pressed: {
		opacity: 0.72,
	},
	version: {
		fontSize: 10,
		fontWeight: '700',
		letterSpacing: 1.2,
		marginTop: 30,
		textAlign: 'center',
	},
	signOutButton: {
		alignItems: 'center',
		borderRadius: 12,
		borderWidth: 1,
		marginTop: 26,
		paddingVertical: 15,
	},
	signOutText: {
		fontSize: 12,
		fontWeight: '900',
		letterSpacing: 1.2,
	},
});
