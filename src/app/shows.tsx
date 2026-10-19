import { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import BottomNav from '../components/bottom-nav';

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
  if (!value) return '';
  return value.slice(0, 5);
}

function scheduleText(show: Show): string {
  const days = show.days_of_week?.length
    ? show.days_of_week.join(', ')
    : show.day_of_week;
  const times = [formatTime(show.start_time), formatTime(show.end_time)]
    .filter(Boolean)
    .join(' - ');
  return [days, times].filter(Boolean).join('  |  ');
}

export default function ShowsScreen() {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadShows = useCallback(async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/api/shows`);
      if (!response.ok) throw new Error('Could not load shows.');
      const data = await response.json();
      setShows(Array.isArray(data) ? data : data.shows || []);
    } catch (loadError) {
      console.error(loadError);
      setError('Unable to load shows. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadShows();
            }}
            tintColor={RED}
            colors={[RED]}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerSmall}>OPENMICFM</Text>
            <Text style={styles.headerTitle}>SHOWS</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{shows.length}</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introRed}>MEET</Text>
          <Text style={styles.introWhite}>THE VOICES.</Text>
          <Text style={styles.introText}>Explore the shows and presenters on OpenMicFM.</Text>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={RED} />
            <Text style={styles.stateText}>LOADING SHOWS</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>SHOWS UNAVAILABLE</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadShows} style={styles.retryButton}>
              <Text style={styles.retryText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : shows.length ? (
          <View style={styles.showList}>
            {shows.map((show) => {
              const image = resolveImageUrl(show.image);
              const name = show.name || show.title || 'OpenMicFM Show';
              return (
                <TouchableOpacity
                  key={show.id}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: '/show/[id]',
                      params: { id: String(show.id) },
                    })
                  }
                  style={styles.showCard}
                >
                  {image ? (
                    <Image source={{ uri: image }} style={styles.showImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.showPlaceholder}>
                      <Text style={styles.placeholderMark}>OM</Text>
                    </View>
                  )}
                  <View style={styles.showInfo}>
                    <Text style={styles.schedule}>{scheduleText(show) || 'OPENMICFM'}</Text>
                    <Text style={styles.showName} numberOfLines={2}>{name}</Text>
                    <Text style={styles.presenter} numberOfLines={1}>
                      {show.presenter || 'OpenMicFM Presenter'}
                    </Text>
                    {show.description ? (
                      <Text style={styles.description} numberOfLines={2}>
                        {show.description}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>NO SHOWS</Text>
            <Text style={styles.errorText}>There are no shows available right now.</Text>
          </View>
        )}
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
const SURFACE_LIGHT = '#1E1E1E';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BLACK },
  scroll: { flex: 1 },
  content: { paddingTop: 55, paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 27 },
  backButton: {
    width: 38,
    height: 38,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: { color: WHITE, fontSize: 28, lineHeight: 28 },
  headerText: { flex: 1 },
  headerSmall: { color: RED, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: WHITE, fontSize: 25, fontWeight: '900', marginTop: 2 },
  countBadge: { width: 38, height: 38, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  countText: { color: WHITE, fontSize: 11, fontWeight: '900' },
  intro: { marginBottom: 24 },
  introRed: { color: RED, fontSize: 39, lineHeight: 39, fontWeight: '900' },
  introWhite: { color: WHITE, fontSize: 39, lineHeight: 42, fontWeight: '900' },
  introText: { color: GREY, fontSize: 12, lineHeight: 19, marginTop: 12 },
  showList: { gap: 10 },
  showCard: {
    minHeight: 124,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  showImage: { width: 108, height: 124, backgroundColor: SURFACE_LIGHT },
  showPlaceholder: { width: 108, height: 124, backgroundColor: RED_DARK, alignItems: 'center', justifyContent: 'center' },
  placeholderMark: { color: WHITE, fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  showInfo: { flex: 1, paddingHorizontal: 13, paddingVertical: 12 },
  schedule: { color: YELLOW, fontSize: 8, fontWeight: '900', letterSpacing: 0.6, marginBottom: 6 },
  showName: { color: WHITE, fontSize: 15, lineHeight: 19, fontWeight: '900' },
  presenter: { color: WHITE, fontSize: 11, marginTop: 5 },
  description: { color: GREY, fontSize: 9, lineHeight: 14, marginTop: 6 },
  arrow: { color: GREY, fontSize: 24, paddingRight: 10 },
  stateBox: { minHeight: 170, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center', padding: 22 },
  stateText: { color: GREY, fontSize: 10, fontWeight: '900', marginTop: 12, letterSpacing: 1 },
  errorTitle: { color: WHITE, fontSize: 14, fontWeight: '900' },
  errorText: { color: GREY, fontSize: 12, textAlign: 'center', marginTop: 8 },
  retryButton: { backgroundColor: RED, paddingVertical: 10, paddingHorizontal: 18, marginTop: 16 },
  retryText: { color: WHITE, fontSize: 10, fontWeight: '900' },
  bottomSpace: { height: 95 },
});