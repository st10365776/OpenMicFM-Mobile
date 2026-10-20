import { useCallback, useEffect, useMemo, useState } from 'react';

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
const SURFACE = '#151515';
const SURFACE_LIGHT = '#1E1E1E';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

/* =========================================================
   TYPES 
========================================================= */

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


const SPORTS = [
  'RUGBY',
  'FOOTBALL',
  'CRICKET',
  'GOLF',
  'MOTORSPORT',
  'TENNIS',
  'BOXING',
  'CYCLING',
  'ATHLETICS',
  'HOCKEY',
  'MMA',
  'NETBALL',
] as const;

type SportFilter = 'ALL' | (typeof SPORTS)[number];

/* =========================================================
   HELPERS
========================================================= */

function imageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* =========================================================
   MAIN
========================================================= */

export default function SportsScreen() {
  const router = useRouter();
  const styles = useThemedStyles(baseStyles);

  const [posts, setPosts] = useState<Post[]>([]);
  const [sport, setSport] = useState<SportFilter>('ALL');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  /* LOAD SPORT POSTS -------------------------------------- */

  const loadSport = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(
        `${API_URL}/api/posts?status=Published&type=Sport`
      );

      if (!response.ok) {
        throw new Error('Could not load sports.');
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load sport news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSport();
  }, [loadSport]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSport();
  };

  /* FILTER BY SPORT ---------------------------------------- */
 

  const filteredPosts = useMemo(() => {
    if (sport === 'ALL') return posts;

    const needle = sport.toLowerCase();

    return posts.filter((post) =>
      `${post.title} ${post.excerpt ?? ''}`.toLowerCase().includes(needle)
    );
  }, [posts, sport]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  // Back goes to wherever the person came from the news page.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/news');
    }
  };

  // Opens the in-app story screen .
  const openStory = (post: Post) => {
    router.push({
      pathname: '/story',
      params: { id: String(post.id) },
    });
  };

  /* LOADING ------------------------------------------------ */

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>OM</Text>
        </View>

        <ActivityIndicator size="large" color={RED} />

        <Text style={styles.loadingText}>LOADING SPORT</Text>
        <Text style={styles.loadingSubtext}>OpenMicFM</Text>
      </View>
    );
  }

  /* SCREEN ------------------------------------------------- */

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
            onRefresh={onRefresh}
            tintColor={RED}
            colors={[RED]}
          />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={goBack}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerSmall}>OPENMICFM</Text>
            <Text style={styles.headerTitle}>SPORT</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{posts.length}</Text>
          </View>
        </View>

        {/* ERROR */}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>SPORT UNAVAILABLE</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={loadSport}>
              <Text style={styles.retryText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* INTRO */}

        <View style={styles.intro}>
          <Text style={styles.introRed}>LATEST</Text>
          <Text style={styles.introWhite}>SPORT NEWS</Text>

          <Text style={styles.introDescription}>
            Scores, results and stories from local and national sport.
          </Text>
        </View>

        {/* SPORT CHIPS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContainer}
        >
          <Chip
            label="ALL"
            active={sport === 'ALL'}
            onPress={() => setSport('ALL')}
          />

          {SPORTS.map((name) => (
            <Chip
              key={name}
              label={name}
              active={sport === name}
              onPress={() => setSport(name)}
            />
          ))}
        </ScrollView>

        {/* TOP STORY */}

        {featuredPost ? (
          <>
            <SectionHeader number="01" title="TOP STORY" />
            <FeaturedCard
              post={featuredPost}
              onPress={() => openStory(featuredPost)}
            />
          </>
        ) : null}

        {/* MORE STORIES */}

        {remainingPosts.length > 0 && (
          <>
            <SectionHeader number="02" title="MORE SPORT" />

            <View style={styles.list}>
              {remainingPosts.map((post) => (
                <StoryRow
                  key={post.id}
                  post={post}
                  onPress={() => openStory(post)}
                />
              ))}
            </View>
          </>
        )}

        {/* EMPTY */}

        {filteredPosts.length === 0 && !error && (
          <View style={styles.noStories}>
            <Text style={styles.noStoriesIcon}>—</Text>
            <Text style={styles.noStoriesTitle}>NO STORIES</Text>

            <Text style={styles.noStoriesText}>
              {sport === 'ALL'
                ? 'No published sport stories yet.'
                : `No ${sport.toLowerCase()} stories right now.`}
            </Text>

            {sport !== 'ALL' && (
              <TouchableOpacity
                style={styles.allButton}
                onPress={() => setSport('ALL')}
              >
                <Text style={styles.allButtonText}>VIEW ALL SPORT</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* MORE NEWS LINK */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.newsLink}
          onPress={() => router.push('/news')}
        >
          <View style={styles.newsLinkText}>
            <Text style={styles.newsLinkSmall}>LOCAL &amp; NATIONAL</Text>
            <Text style={styles.newsLinkTitle}>MORE NEWS</Text>
          </View>

          <Text style={styles.newsLinkArrow}>→</Text>
        </TouchableOpacity>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>OPENMICFM</Text>
          <Text style={styles.footerText}>THE STATION WITH PROGRESS</Text>
          <Text style={styles.footerLocation}>GQEBERHA • SOUTH AFRICA</Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(baseStyles);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FeaturedCard({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) {
  const styles = useThemedStyles(baseStyles);

  const uri = imageUrl(post.image);
  const date = formatDate(post.published_at || post.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.featuredCard}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.featuredPlaceholder}>
          <Text style={styles.placeholderText}>OPENMICFM</Text>
        </View>
      )}

      <View style={styles.featuredContent}>
        <Text style={styles.featuredType}>
          SPORT{date ? `  •  ${date.toUpperCase()}` : ''}
        </Text>

        <Text style={styles.featuredTitle}>{post.title}</Text>

        {post.excerpt ? (
          <Text style={styles.featuredExcerpt} numberOfLines={3}>
            {post.excerpt}
          </Text>
        ) : null}

        <View style={styles.featuredBottom}>
          <Text style={styles.readStory}>READ STORY →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StoryRow({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) {
  const styles = useThemedStyles(baseStyles);

  const uri = imageUrl(post.image);
  const date = formatDate(post.published_at || post.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.row}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.rowImage} resizeMode="cover" />
      ) : (
        <View style={styles.rowImagePlaceholder}>
          <Text style={styles.rowPlaceholderText}>OM</Text>
        </View>
      )}

      <View style={styles.rowInfo}>
        <Text style={styles.rowType}>
          SPORT{date ? `  •  ${date.toUpperCase()}` : ''}
        </Text>

        <Text style={styles.rowTitle} numberOfLines={3}>
          {post.title}
        </Text>

        {post.excerpt ? (
          <Text style={styles.rowExcerpt} numberOfLines={1}>
            {post.excerpt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  const styles = useThemedStyles(baseStyles);

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <Text style={styles.sectionNumber}>{number}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <View style={styles.sectionLine} />
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BLACK },
  scroll: { flex: 1, backgroundColor: BLACK },
  content: { paddingTop: 55, paddingHorizontal: 18 },

  /* HEADER */

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },

  backButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: { color: WHITE, fontSize: 28, lineHeight: 28 },

  headerText: { flex: 1 },
  headerSmall: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerTitle: { color: WHITE, fontSize: 25, fontWeight: '900', marginTop: 2 },

  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: WHITE, fontSize: 11, fontWeight: '900' },

  /* INTRO */

  intro: { marginBottom: 22 },
  introRed: {
    color: RED,
    fontSize: 40,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  introWhite: {
    color: WHITE,
    fontSize: 40,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  introDescription: {
    color: GREY,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
    maxWidth: 330,
  },

  /* CHIPS */

  chipScroll: { marginHorizontal: -18 },
  chipContainer: { paddingHorizontal: 18, gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: { backgroundColor: RED, borderColor: RED },
  chipText: {
    color: GREY,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  chipTextActive: { color: WHITE },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 31,
    marginBottom: 12,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionNumber: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    marginRight: 9,
  },
  sectionTitle: { color: WHITE, fontSize: 19, fontWeight: '900' },
  sectionLine: {
    height: 1,
    flex: 1,
    backgroundColor: BORDER,
    marginLeft: 12,
  },

  /* FEATURED */

  featuredCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  featuredImage: { width: '100%', height: 185, backgroundColor: SURFACE_LIGHT },
  featuredPlaceholder: {
    width: '100%',
    height: 185,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  featuredContent: { padding: 17 },
  featuredType: {
    color: YELLOW,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 7,
  },
  featuredTitle: {
    color: WHITE,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
  },
  featuredExcerpt: {
    color: GREY,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
  },
  featuredBottom: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 14,
    paddingTop: 12,
  },
  readStory: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  /* LIST */

  list: { gap: 9 },
  row: {
    flexDirection: 'row',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    minHeight: 100,
    overflow: 'hidden',
  },
  rowImage: { width: 105, height: 100, backgroundColor: SURFACE_LIGHT },
  rowImagePlaceholder: {
    width: 105,
    height: 100,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPlaceholderText: { color: WHITE, fontSize: 18, fontWeight: '900' },
  rowInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  rowType: {
    color: YELLOW,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },
  rowTitle: { color: WHITE, fontSize: 12, lineHeight: 17, fontWeight: '900' },
  rowExcerpt: { color: GREY, fontSize: 9, lineHeight: 13, marginTop: 5 },

  /* EMPTY */

  noStories: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
  },
  noStoriesIcon: { color: RED, fontSize: 30, fontWeight: '900' },
  noStoriesTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },
  noStoriesText: {
    color: GREY,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 7,
  },
  allButton: {
    backgroundColor: RED,
    paddingVertical: 11,
    paddingHorizontal: 15,
    marginTop: 17,
  },
  allButtonText: { color: WHITE, fontSize: 9, fontWeight: '900' },

  /* NEWS LINK */

  newsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: RED,
    padding: 18,
    marginTop: 34,
  },
  newsLinkText: { flex: 1 },
  newsLinkSmall: {
    color: YELLOW,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  newsLinkTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },
  newsLinkArrow: {
    color: RED,
    fontSize: 26,
    fontWeight: '900',
    marginLeft: 12,
  },

  /* ERROR */

  errorBox: {
    backgroundColor: '#241010',
    borderWidth: 1,
    borderColor: RED_DARK,
    padding: 15,
    marginBottom: 15,
  },
  errorTitle: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  errorText: { color: GREY, fontSize: 11, lineHeight: 17, marginTop: 6 },
  retryButton: {
    backgroundColor: RED,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
  },
  retryText: { color: WHITE, fontSize: 9, fontWeight: '900' },

  /* FOOTER */

  footer: { alignItems: 'center', paddingVertical: 38 },
  footerLogo: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    color: GREY,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 5,
  },
  footerLocation: { color: '#555555', fontSize: 7, marginTop: 10 },
  bottomSpace: { height: 65 },

  /* LOADING */

  loadingScreen: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 65,
    height: 65,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  loadingLogoText: { color: WHITE, fontSize: 23, fontWeight: '900' },
  loadingText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 14,
  },
  loadingSubtext: { color: GREY, fontSize: 10, marginTop: 6 },
});