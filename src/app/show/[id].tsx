import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import BottomNav from '../../components/bottom-nav';
import { useThemedStyles } from '../../context/app-context';

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

type Show = {
  id: number;
  name?: string;
  title?: string;
  presenter?: string;
  description?: string;
  image?: string;
  day_of_week?: string;
  days_of_week?: string[];
  start_time?: string;
  end_time?: string;
};

function resolveImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${API_URL}${image}`;
  return `${API_URL}/uploads/${image}`;
}

function formatTime(value?: string): string {
  return value ? value.slice(0, 5) : '';
}

export default function ShowDetailScreen() {
  const router = useRouter();
  const styles = useThemedStyles(baseStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadShow() {
      try {
        const response = await fetch(`${API_URL}/api/shows`);
        if (!response.ok) throw new Error('Could not load this show.');
        const data = await response.json();
        const shows: Show[] = Array.isArray(data) ? data : data.shows || [];
        const selectedShow = shows.find((item) => String(item.id) === id);

        if (!selectedShow) throw new Error('This show is no longer available.');
        if (active) setShow(selectedShow);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load this show.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadShow();
    return () => {
      active = false;
    };
  }, [id]);

  const image = resolveImageUrl(show?.image);
  const name = show?.name || show?.title || 'OpenMicFM Show';
  const days = show?.days_of_week?.length
    ? show.days_of_week.join(', ')
    : show?.day_of_week;
  const time = [formatTime(show?.start_time), formatTime(show?.end_time)]
    .filter(Boolean)
    .join(' - ');

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Back to shows"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/shows' as never))}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSmall}>OPENMICFM</Text>
            <Text style={styles.headerTitle}>PRESENTER</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={RED} size="large" />
            <Text style={styles.stateText}>LOADING SHOW</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>SHOW UNAVAILABLE</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => router.replace('/shows' as never)} style={styles.retryButton}>
              <Text style={styles.retryText}>VIEW ALL SHOWS</Text>
            </TouchableOpacity>
          </View>
        ) : show ? (
          <>
            {image ? (
              <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <View style={styles.heroPlaceholder}>
                <Text style={styles.placeholderMark}>OPENMICFM</Text>
              </View>
            )}
            <Text style={styles.eyebrow}>ON OPENMICFM</Text>
            <Text style={styles.showName}>{name}</Text>
            <Text style={styles.presenter}>{show.presenter || 'OpenMicFM Presenter'}</Text>

            <View style={styles.scheduleBlock}>
              <Text style={styles.scheduleLabel}>ON AIR</Text>
              {days ? <Text style={styles.scheduleValue}>{days}</Text> : null}
              {time ? <Text style={styles.scheduleTime}>{time}</Text> : null}
            </View>

            {show.description ? (
              <View style={styles.aboutBlock}>
                <Text style={styles.aboutTitle}>ABOUT THE SHOW</Text>
                <Text style={styles.description}>{show.description}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.allShowsButton}
              activeOpacity={0.8}
              onPress={() => router.push('/shows' as never)}
            >
              <Text style={styles.allShowsText}>EXPLORE ALL SHOWS  →</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <View style={styles.bottomSpace} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const RED = '#D71920';
const RED_DARK = '#A80F15';
const YELLOW = '#FFD200';
const BLACK = '#000000';
const SURFACE = '#151515';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BLACK },
  scroll: { flex: 1 },
  content: { paddingTop: 55, paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { width: 38, height: 38, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backText: { color: WHITE, fontSize: 28, lineHeight: 28 },
  headerSmall: { color: RED, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: WHITE, fontSize: 24, fontWeight: '900', marginTop: 2 },
  heroImage: { width: '100%', height: 260, backgroundColor: SURFACE },
  heroPlaceholder: { width: '100%', height: 220, backgroundColor: RED_DARK, alignItems: 'center', justifyContent: 'center' },
  placeholderMark: { color: WHITE, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  eyebrow: { color: YELLOW, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginTop: 24 },
  showName: { color: WHITE, fontSize: 31, lineHeight: 37, fontWeight: '900', marginTop: 7 },
  presenter: { color: GREY, fontSize: 16, marginTop: 8 },
  scheduleBlock: { borderLeftWidth: 3, borderLeftColor: RED, backgroundColor: SURFACE, padding: 16, marginTop: 24 },
  scheduleLabel: { color: YELLOW, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  scheduleValue: { color: WHITE, fontSize: 15, fontWeight: '800', marginTop: 9 },
  scheduleTime: { color: GREY, fontSize: 13, marginTop: 4 },
  aboutBlock: { marginTop: 30 },
  aboutTitle: { color: WHITE, fontSize: 17, fontWeight: '900' },
  description: { color: GREY, fontSize: 14, lineHeight: 22, marginTop: 12 },
  allShowsButton: { alignSelf: 'flex-start', borderWidth: 1, borderColor: RED, paddingHorizontal: 15, paddingVertical: 12, marginTop: 30 },
  allShowsText: { color: WHITE, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  stateBox: { minHeight: 180, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center', padding: 22 },
  stateText: { color: GREY, fontSize: 10, fontWeight: '900', marginTop: 12, letterSpacing: 1 },
  errorTitle: { color: WHITE, fontSize: 14, fontWeight: '900' },
  errorText: { color: GREY, fontSize: 12, textAlign: 'center', marginTop: 8 },
  retryButton: { backgroundColor: RED, paddingVertical: 10, paddingHorizontal: 18, marginTop: 16 },
  retryText: { color: WHITE, fontSize: 10, fontWeight: '900' },
  bottomSpace: { height: 95 },
});

const styles = baseStyles;