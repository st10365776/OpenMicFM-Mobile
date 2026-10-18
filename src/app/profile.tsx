import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/bottom-nav';
import { useAppContext } from '../context/app-context';

export default function ProfileScreen() {
	const router = useRouter();
	const { colors, themeMode, user } = useAppContext();

	return (
		<SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
			<StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={[styles.eyebrow, { color: colors.red }]}>OPENMICFM</Text>
				<Text style={[styles.title, { color: colors.text }]}>Your profile</Text>

				{user ? (
					<View
						style={[
							styles.card,
							{ backgroundColor: colors.surface, borderColor: colors.border },
						]}
					>
						<View style={[styles.avatar, { backgroundColor: colors.red }]}>
							<Text style={styles.avatarText}>
								{(user.fullName || user.email || 'OM')
									.split(/\s+/)
									.slice(0, 2)
									.map((part) => part[0])
									.join('')
									.toUpperCase()}
							</Text>
						</View>
						<Text style={[styles.name, { color: colors.text }]}>
							{user.fullName || 'OpenMicFM listener'}
						</Text>
						<Text style={[styles.email, { color: colors.muted }]}>
							{user.email || 'Email address not provided'}
						</Text>
						<View style={[styles.divider, { backgroundColor: colors.border }]} />
						{Object.entries(user)
							.filter(
								(entry): entry is [string, string] => {
									const [key, value] = entry;
									return (
										typeof value === 'string' &&
										value.trim().length > 0 &&
										!/(password|token|secret|hash|salt|^id$)/i.test(key) &&
										!/(fullName|email)/i.test(key)
									);
								}
							)
							.map(([key, value]) => (
								<ProfileDetail
									key={key}
									label={key
										.replace(/([A-Z])/g, ' $1')
										.replace(/[_-]/g, ' ')
										.trim()
										.toUpperCase()}
									value={value}
									colors={colors}
								/>
							))}
					</View>
				) : (
					<View
						style={[
							styles.card,
							{ backgroundColor: colors.surface, borderColor: colors.border },
						]}
					>
						<Text style={[styles.name, { color: colors.text }]}>Sign in to your account</Text>
						<Text style={[styles.guestCopy, { color: colors.muted }]}>
							Use the email address and password for your OpenMicFM account to see your profile details.
						</Text>
						<Pressable
							style={[styles.actionButton, { backgroundColor: colors.red }]}
							onPress={() => router.push('/login' as never)}
							accessibilityRole="button"
						>
							<Text style={styles.actionText}>LOG IN</Text>
						</Pressable>
						<Pressable onPress={() => router.push('/register' as never)} accessibilityRole="button">
							<Text style={[styles.registerText, { color: colors.red }]}>Create an account</Text>
						</Pressable>
					</View>
				)}
			</ScrollView>
			<BottomNav />
		</SafeAreaView>
	);
}

function ProfileDetail({
	label,
	value,
	colors,
}: {
	label: string;
	value?: string;
	colors: ReturnType<typeof useAppContext>['colors'];
}) {
	if (!value) return null;
	return (
		<View style={styles.detail}>
			<Text style={[styles.detailLabel, { color: colors.muted }]}>{label}</Text>
			<Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1 },
	content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 110 },
	eyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
	title: { fontSize: 32, fontWeight: '900', marginBottom: 24 },
	card: { alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 22 },
	avatar: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 32 },
	avatarText: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
	name: { fontSize: 20, fontWeight: '800', marginTop: 16, textAlign: 'center' },
	email: { fontSize: 13, marginTop: 6, textAlign: 'center' },
	divider: { height: StyleSheet.hairlineWidth, alignSelf: 'stretch', marginVertical: 22 },
	detail: { alignSelf: 'stretch', marginBottom: 18 },
	detailLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
	detailValue: { fontSize: 15, fontWeight: '600' },
	guestCopy: { fontSize: 14, lineHeight: 21, marginTop: 10, textAlign: 'center' },
	actionButton: { alignSelf: 'stretch', alignItems: 'center', borderRadius: 9, marginTop: 24, padding: 15 },
	actionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
	registerText: { fontSize: 13, fontWeight: '700', marginTop: 20 },
});
