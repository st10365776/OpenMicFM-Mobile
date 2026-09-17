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

import { useRouter } from 'expo-router';

import BottomNav from '../components/bottom-nav';

/* =========================================================
   API
========================================================= */

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

/* =========================================================
   COLOURS
========================================================= */

const RED = '#D71920';
const RED_DARK = '#A80F15';
const YELLOW = '#FFD200';
const BLACK = '#000000';
const DARK = '#0D0D0D';
const SURFACE = '#151515';
const SURFACE_LIGHT = '#1E1E1E';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

/* =========================================================
   TYPES
========================================================= */

type Song = {
  id: number;
  rank: number;
  title: string;
  artist: string;
  plays?: number;
  image?: string;
  visible?: boolean;
};

type Post = {
  id: number;
  type: string;
  title: string;
  excerpt?: string;
  body?: string;
  image?: string;
  status: string;
  published_at?: string;
  created_at?: string;
};

type Show = {
  id: number;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  presenter?: string;
  start_time?: string;
  end_time?: string;
};

/* =========================================================
   MAIN
========================================================= */

export default function HomeScreen() {
  const router = useRouter();

  const [songs, setSongs] = useState<Song[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  /* =======================================================
     IMAGE URL
  ======================================================= */

  const imageUrl = (image?: string) => {
    if (!image) return null;

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {
      return image;
    }

    return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = useCallback(async () => {
    try {
      setError('');

      const [songsResponse, postsResponse, showsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/songs?public=1`),
          fetch(`${API_URL}/api/posts?status=Published`),
          fetch(`${API_URL}/api/shows`),
        ]);

      if (!songsResponse.ok) {
        throw new Error('Could not load songs.');
      }

      if (!postsResponse.ok) {
        throw new Error('Could not load news.');
      }

      if (!showsResponse.ok) {
        throw new Error('Could not load shows.');
      }

      const songsData = await songsResponse.json();
      const postsData = await postsResponse.json();
      const showsData = await showsResponse.json();

      const cleanSongs = Array.isArray(songsData)
        ? songsData
        : songsData.songs || [];

      const cleanPosts = Array.isArray(postsData)
        ? postsData
        : postsData.posts || [];

      const cleanShows = Array.isArray(showsData)
        ? showsData
        : showsData.shows || [];

      setSongs(
        cleanSongs
          .filter((song: Song) => song.visible !== false)
          .sort(
            (a: Song, b: Song) =>
              Number(a.rank || 999) -
              Number(b.rank || 999)
          )
          .slice(0, 10)
      );

      setPosts(cleanPosts);

      setShows(cleanShows);
    } catch (err) {
      console.error(err);

      setError(
        'Unable to load OpenMicFM content. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /* =======================================================
     DATA
  ======================================================= */

  const topStories = posts
    .filter(
      (post) =>
        post.type?.toLowerCase() !== 'sport' &&
        post.type?.toLowerCase() !== 'sports'
    )
    .slice(0, 2);

  const topSport = posts
    .filter(
      (post) =>
        post.type?.toLowerCase() === 'sport' ||
        post.type?.toLowerCase() === 'sports'
    )
    .slice(0, 2);

  const currentShow = shows[0];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>OM</Text>
        </View>

        <ActivityIndicator
          size="large"
          color={RED}
          style={styles.loadingSpinner}
        />

        <Text style={styles.loadingText}>
          LOADING OPENMICFM
        </Text>

        <Text style={styles.loadingSubtext}>
          Your station. Your voice.
        </Text>
      </View>
    );
  }

  /* =======================================================
     SCREEN
  ======================================================= */

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={RED}
            colors={[RED]}
          />
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.headerSmall}>
              OPENMICFM
            </Text>

            <Text style={styles.headerTitle}>
              THE STATION
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              LIVE
            </Text>
          </View>
        </View>

        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              CONNECTION ERROR
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadData}
            >
              <Text style={styles.retryText}>
                RETRY
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>
          <View style={styles.heroAccent} />

          <Text style={styles.heroEyebrow}>
            YOUR COMMUNITY RADIO
          </Text>

          <Text style={styles.heroTitle}>
            YOUR VOICE.
          </Text>

          <Text style={styles.heroTitleRed}>
            YOUR STATION.
          </Text>

          <Text style={styles.heroDescription}>
            Local stories, great music, sport and the
            voices that matter to Gqeberha.
          </Text>

          <TouchableOpacity
            style={styles.listenButton}
            activeOpacity={0.8}
          >
            <Text style={styles.listenButtonText}>
              ▶  LISTEN NOW
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>
              RADIO
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {songs.length}
            </Text>
            <Text style={styles.statLabel}>
              TOP SONGS
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {posts.length}
            </Text>
            <Text style={styles.statLabel}>
              STORIES
            </Text>
          </View>
        </View>

        {/* =================================================
            TOP 10 SONGS
        ================================================= */}

        <SectionHeader
          number="01"
          title="TOP 10 SONGS"
          action="MUSIC"
          onPress={() => router.push('/music')}
        />

        <View style={styles.songsCard}>
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                imageUrl={imageUrl(song.image)}
              />
            ))
          ) : (
            <EmptyState text="No songs available." />
          )}
        </View>

        {/* =================================================
            TOP STORIES
        ================================================= */}

        <SectionHeader
          number="02"
          title="TOP STORIES"
          action="VIEW ALL"
          onPress={() => router.push('/news')}
        />

        {topStories.length > 0 ? (
          <View style={styles.storyList}>
            {topStories.map((post, index) => (
              <StoryCard
                key={post.id}
                post={post}
                imageUrl={imageUrl(post.image)}
                featured={index === 0}
              />
            ))}
          </View>
        ) : (
          <EmptyState text="No published stories available." />
        )}

        {/* =================================================
            TOP SPORT
        ================================================= */}

        <SectionHeader
          number="03"
          title="TOP SPORT"
          action="SPORT"
          onPress={() => router.push('/news')}
        />

        {topSport.length > 0 ? (
          <View style={styles.storyList}>
            {topSport.map((post) => (
              <StoryCard
                key={`sport-${post.id}`}
                post={post}
                imageUrl={imageUrl(post.image)}
              />
            ))}
          </View>
        ) : (
          <EmptyState text="No sport stories available." />
        )}

        {/* =================================================
            ON AIR
        ================================================= */}

        <SectionHeader
          number="04"
          title="ON AIR"
        />

        <View style={styles.onAirCard}>
          <View style={styles.onAirTop}>
            <View style={styles.onAirLive}>
              <View style={styles.liveDot} />

              <Text style={styles.onAirLiveText}>
                ON AIR NOW
              </Text>
            </View>

            <Text style={styles.onAirTime}>
              24/7
            </Text>
          </View>

          <Text style={styles.onAirTitle}>
            {currentShow?.name ||
              currentShow?.title ||
              'OPENMICFM RADIO'}
          </Text>

          <Text style={styles.onAirPresenter}>
            {currentShow?.presenter ||
              'OPENMICFM'}
          </Text>

          <View style={styles.waveRow}>
            {[18, 28, 42, 25, 36, 48, 24, 40, 30, 18].map(
              (height, index) => (
                <View
                  key={index}
                  style={[
                    styles.wave,
                    { height },
                  ]}
                />
              )
            )}
          </View>
        </View>

        {/* =================================================
            COMMUNITY
        ================================================= */}

        <View style={styles.communityCard}>
          <Text style={styles.communityEyebrow}>
            OPENMICFM COMMUNITY
          </Text>

          <Text style={styles.communityTitle}>
            YOUR VOICE
            {'\n'}
            MATTERS.
          </Text>

          <Text style={styles.communityText}>
            Stay connected with the latest stories,
            music and conversations from your community.
          </Text>

          <TouchableOpacity
            style={styles.communityButton}
            onPress={() => router.push('/news')}
          >
            <Text style={styles.communityButtonText}>
              EXPLORE NEWS →
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            ADVERTISE
        ================================================= */}

        <View style={styles.advertiseCard}>
          <Text style={styles.advertiseSmall}>
            BUSINESS?
          </Text>

          <Text style={styles.advertiseTitle}>
            ADVERTISE
            {'\n'}
            WITH US.
          </Text>

          <Text style={styles.advertiseText}>
            Put your brand in front of the OpenMicFM
            listening community.
          </Text>

          <TouchableOpacity
            style={styles.advertiseButton}
          >
            <Text style={styles.advertiseButtonText}>
              GET IN TOUCH
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            OPENMICFM
          </Text>

          <Text style={styles.footerText}>
            THE STATION WITH PROGRESS
          </Text>

          <Text style={styles.footerCopyright}>
            GQEBERHA • SOUTH AFRICA
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  title,
  action,
  onPress,
}: {
  number: string;
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionNumber}>
          {number}
        </Text>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      </View>

      {action ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionAction}>
            {action} →
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* =========================================================
   SONG ROW
========================================================= */

function SongRow({
  song,
  index,
  imageUrl,
}: {
  song: Song;
  index: number;
  imageUrl: string | null;
}) {
  return (
    <View style={styles.songRow}>
      <Text style={styles.songRank}>
        {String(index + 1).padStart(2, '0')}
      </Text>

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.songImage}
        />
      ) : (
        <View style={styles.songImagePlaceholder}>
          <Text style={styles.songPlaceholderText}>
            ♪
          </Text>
        </View>
      )}

      <View style={styles.songInfo}>
        <Text
          style={styles.songTitle}
          numberOfLines={1}
        >
          {song.title}
        </Text>

        <Text
          style={styles.songArtist}
          numberOfLines={1}
        >
          {song.artist}
        </Text>
      </View>

      <Text style={styles.songArrow}>›</Text>
    </View>
  );
}

/* =========================================================
   STORY CARD
========================================================= */

function StoryCard({
  post,
  imageUrl,
  featured = false,
}: {
  post: Post;
  imageUrl: string | null;
  featured?: boolean;
}) {
  return (
    <View
      style={[
        styles.storyCard,
        featured && styles.featuredStoryCard,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.storyImage,
            featured && styles.featuredStoryImage,
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.storyImagePlaceholder,
            featured && styles.featuredStoryImage,
          ]}
        >
          <Text style={styles.storyPlaceholderText}>
            OPENMICFM
          </Text>
        </View>
      )}

      <View style={styles.storyContent}>
        <Text style={styles.storyType}>
          {post.type?.toUpperCase() || 'NEWS'}
        </Text>

        <Text
          style={[
            styles.storyTitle,
            featured && styles.featuredStoryTitle,
          ]}
          numberOfLines={featured ? 3 : 2}
        >
          {post.title}
        </Text>

        {post.excerpt ? (
          <Text
            style={styles.storyExcerpt}
            numberOfLines={featured ? 2 : 1}
          >
            {post.excerpt}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>
        {text}
      </Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BLACK,
  },

  scroll: {
    flex: 1,
    backgroundColor: BLACK,
  },

  content: {
    paddingTop: 58,
    paddingHorizontal: 18,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerSmall: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },

  headerTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: RED,
    marginRight: 6,
  },

  liveText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* HERO */

  hero: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 22,
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
  },

  heroAccent: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: RED,
    opacity: 0.12,
  },

  heroEyebrow: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 28,
  },

  heroTitle: {
    color: WHITE,
    fontSize: 43,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 43,
  },

  heroTitleRed: {
    color: RED,
    fontSize: 43,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 43,
  },

  heroDescription: {
    color: GREY,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
    maxWidth: 320,
  },

  listenButton: {
    alignSelf: 'flex-start',
    backgroundColor: RED,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginTop: 22,
    borderRadius: 3,
  },

  listenButtonText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  /* STATS */

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
    paddingVertical: 18,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    color: WHITE,
    fontSize: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: GREY,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: BORDER,
  },

  /* SECTION HEADER */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 34,
    marginBottom: 12,
  },

  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionNumber: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
    marginRight: 9,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  sectionAction: {
    color: YELLOW,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* SONGS */

  songsCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },

  songRow: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  songRank: {
    width: 29,
    color: GREY,
    fontSize: 10,
    fontWeight: '900',
  },

  songImage: {
    width: 45,
    height: 45,
    borderRadius: 3,
    backgroundColor: SURFACE_LIGHT,
  },

  songImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 3,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  songPlaceholderText: {
    color: WHITE,
    fontSize: 20,
  },

  songInfo: {
    flex: 1,
    paddingHorizontal: 11,
  },

  songTitle: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '800',
  },

  songArtist: {
    color: GREY,
    fontSize: 10,
    marginTop: 4,
  },

  songArrow: {
    color: GREY,
    fontSize: 22,
  },

  /* STORIES */

  storyList: {
    gap: 10,
  },

  storyCard: {
    flexDirection: 'row',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    minHeight: 105,
    overflow: 'hidden',
  },

  featuredStoryCard: {
    flexDirection: 'column',
  },

  storyImage: {
    width: 108,
    height: 105,
    backgroundColor: SURFACE_LIGHT,
  },

  featuredStoryImage: {
    width: '100%',
    height: 165,
  },

  storyImagePlaceholder: {
    width: 108,
    height: 105,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  storyPlaceholderText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  storyContent: {
    flex: 1,
    padding: 13,
    justifyContent: 'center',
  },

  storyType: {
    color: YELLOW,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },

  storyTitle: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },

  featuredStoryTitle: {
    fontSize: 19,
    lineHeight: 24,
  },

  storyExcerpt: {
    color: GREY,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },

  /* ON AIR */

  onAirCard: {
    backgroundColor: RED,
    padding: 20,
  },

  onAirTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  onAirLive: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onAirLiveText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  onAirTime: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
  },

  onAirTitle: {
    color: WHITE,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 28,
  },

  onAirPresenter: {
    color: WHITE,
    opacity: 0.75,
    fontSize: 11,
    marginTop: 4,
  },

  waveRow: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 18,
  },

  wave: {
    width: 5,
    backgroundColor: WHITE,
    opacity: 0.8,
    borderRadius: 3,
  },

  /* COMMUNITY */

  communityCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 22,
    marginTop: 34,
  },

  communityEyebrow: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  communityTitle: {
    color: WHITE,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 12,
  },

  communityText: {
    color: GREY,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
  },

  communityButton: {
    borderWidth: 1,
    borderColor: RED,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 20,
  },

  communityButtonText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
  },

  /* ADVERTISE */

  advertiseCard: {
    backgroundColor: YELLOW,
    padding: 22,
    marginTop: 12,
  },

  advertiseSmall: {
    color: BLACK,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  advertiseTitle: {
    color: BLACK,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 12,
  },

  advertiseText: {
    color: BLACK,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },

  advertiseButton: {
    backgroundColor: BLACK,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 20,
  },

  advertiseButtonText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    paddingVertical: 38,
  },

  footerLogo: {
    color: RED,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 1,
  },

  footerText: {
    color: GREY,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 6,
  },

  footerCopyright: {
    color: '#555555',
    fontSize: 7,
    marginTop: 12,
    letterSpacing: 0.5,
  },

  bottomSpace: {
    height: 65,
  },

  /* EMPTY */

  emptyBox: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 25,
    alignItems: 'center',
  },

  emptyText: {
    color: GREY,
    fontSize: 11,
  },

  /* ERROR */

  errorBox: {
    backgroundColor: '#241010',
    borderWidth: 1,
    borderColor: RED_DARK,
    padding: 16,
    marginBottom: 15,
  },

  errorTitle: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  errorText: {
    color: GREY,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 17,
  },

  retryButton: {
    backgroundColor: RED,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
  },

  retryText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
  },

  /* LOADING */

  loadingScreen: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingLogo: {
    width: 70,
    height: 70,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  loadingLogoText: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '900',
  },

  loadingSpinner: {
    marginBottom: 14,
  },

  loadingText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  loadingSubtext: {
    color: GREY,
    fontSize: 10,
    marginTop: 7,
  },
});