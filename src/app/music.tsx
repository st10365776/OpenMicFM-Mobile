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
import { useThemedStyles } from '../context/app-context';

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

type Song = {
  id: number;
  rank: number;
  title: string;
  artist: string;
  plays?: number;
  image?: string;
  visible?: boolean;
};

function resolveImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

export default function MusicScreen() {
  const router = useRouter();
  const styles = useThemedStyles(baseStyles);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadSongs = useCallback(async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/api/songs?public=1`);
      if (!response.ok) throw new Error('Could not load the song chart.');

      const data = await response.json();
      const chart = Array.isArray(data) ? data : data.songs || [];

      setSongs(
        chart
          .filter((song: Song) => song.visible !== false)
          .sort((a: Song, b: Song) => Number(a.rank || 999) - Number(b.rank || 999))
      );
    } catch (loadError) {
      console.error(loadError);
      setError('Unable to load the song chart. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

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
              loadSongs();
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
            <Text style={styles.headerTitle}>MUSIC</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{songs.length}</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introRed}>THE SOUND</Text>
          <Text style={styles.introWhite}>OF SOUTH AFRICA.</Text>
          <Text style={styles.introText}>The songs climbing the OpenMicFM chart right now.</Text>
        </View>

        <View style={styles.chartHeading}>
          <View>
            <Text style={styles.chartEyebrow}>OPENMICFM CHART</Text>
            <Text style={styles.chartTitle}>TRENDING IN SA</Text>
          </View>
          <Text style={styles.chartMark}>♪</Text>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={RED} />
            <Text style={styles.stateText}>LOADING THE CHART</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>CHART UNAVAILABLE</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadSongs} style={styles.retryButton}>
              <Text style={styles.retryText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : songs.length ? (
          <View style={styles.songList}>
            {songs.map((song, index) => {
              const image = resolveImageUrl(song.image);
              return (
                <View key={song.id} style={styles.songRow}>
                  <Text style={[styles.songRank, index === 0 && styles.topRank]}>
                    {String(song.rank || index + 1).padStart(2, '0')}
                  </Text>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.songImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.songPlaceholder}>
                      <Text style={styles.placeholderMark}>♪</Text>
                    </View>
                  )}
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                  </View>
                  <View style={styles.plays}>
                    <Text style={styles.playCount}>{Number(song.plays || 0).toLocaleString('en-ZA')}</Text>
                    <Text style={styles.playLabel}>PLAYS</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>NO SONGS YET</Text>
            <Text style={styles.errorText}>The chart will appear here when songs are available.</Text>
          </View>
        )}

        <Text style={styles.chartNote}>Rankings and play counts are updated from the OpenMicFM chart.</Text>
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

const baseStyles = StyleSheet.create({
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
  intro: { marginBottom: 27 },
  introRed: { color: RED, fontSize: 36, lineHeight: 39, fontWeight: '900' },
  introWhite: { color: WHITE, fontSize: 32, lineHeight: 37, fontWeight: '900' },
  introText: { color: GREY, fontSize: 12, lineHeight: 19, marginTop: 12 },
  chartHeading: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: RED_DARK,
  },
  chartEyebrow: { color: YELLOW, fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  chartTitle: { color: WHITE, fontSize: 17, fontWeight: '900', marginTop: 5 },
  chartMark: { color: WHITE, fontSize: 32 },
  songList: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER },
  songRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  songRank: { width: 31, color: GREY, fontSize: 11, fontWeight: '900' },
  topRank: { color: YELLOW },
  songImage: { width: 48, height: 48, backgroundColor: SURFACE_LIGHT },
  songPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderMark: { color: WHITE, fontSize: 21 },
  songInfo: { flex: 1, paddingHorizontal: 11 },
  songTitle: { color: WHITE, fontSize: 12, fontWeight: '800' },
  songArtist: { color: GREY, fontSize: 10, marginTop: 4 },
  plays: { minWidth: 43, alignItems: 'flex-end' },
  playCount: { color: WHITE, fontSize: 11, fontWeight: '900' },
  playLabel: { color: GREY, fontSize: 7, fontWeight: '900', marginTop: 3 },
  stateBox: { minHeight: 170, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center', padding: 22 },
  stateText: { color: GREY, fontSize: 10, fontWeight: '900', marginTop: 12, letterSpacing: 1 },
  errorTitle: { color: WHITE, fontSize: 14, fontWeight: '900' },
  errorText: { color: GREY, fontSize: 12, textAlign: 'center', marginTop: 8 },
  retryButton: { backgroundColor: RED, paddingVertical: 10, paddingHorizontal: 18, marginTop: 16 },
  retryText: { color: WHITE, fontSize: 10, fontWeight: '900' },
  chartNote: { color: GREY, fontSize: 9, lineHeight: 14, marginTop: 12 },
  bottomSpace: { height: 95 },
});