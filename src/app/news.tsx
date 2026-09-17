import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

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

type Category =
  | 'ALL'
  | 'LOCAL'
  | 'NATIONAL'
  | 'SPORT';

/* =========================================================
   MAIN
========================================================= */

export default function NewsScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] =
    useState<Category>('ALL');

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
     LOAD NEWS
  ======================================================= */

  const loadNews = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(
        `${API_URL}/api/posts?status=Published`
      );

      if (!response.ok) {
        throw new Error(
          'Could not load news from the server.'
        );
      }

      const data = await response.json();

      const cleanPosts = Array.isArray(data)
        ? data
        : data.posts || [];

      setPosts(cleanPosts);
    } catch (err) {
      console.error(err);

      setError(
        'Unable to load news. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredPosts = useMemo(() => {
    if (category === 'ALL') {
      return posts;
    }

    return posts.filter((post) => {
      const type =
        post.type?.toLowerCase().trim() || '';

      if (category === 'LOCAL') {
        return type === 'local';
      }

      if (category === 'NATIONAL') {
        return type === 'national';
      }

      if (category === 'SPORT') {
        return (
          type === 'sport' ||
          type === 'sports'
        );
      }

      return true;
    });
  }, [posts, category]);

  /* =======================================================
     FEATURED
  ======================================================= */

  const featuredPost = filteredPosts[0];

  const remainingPosts = filteredPosts.slice(1, 7);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>
            OM
          </Text>
        </View>

        <ActivityIndicator
          size="large"
          color={RED}
        />

        <Text style={styles.loadingText}>
          LOADING NEWS
        </Text>

        <Text style={styles.loadingSubtext}>
          OpenMicFM
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
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerSmall}>
              OPENMICFM
            </Text>

            <Text style={styles.headerTitle}>
              NEWS
            </Text>
          </View>

          <View style={styles.newsBadge}>
            <Text style={styles.newsBadgeText}>
              {posts.length}
            </Text>
          </View>
        </View>

        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              NEWS UNAVAILABLE
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadNews}
            >
              <Text style={styles.retryText}>
                RETRY
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* =================================================
            INTRO
        ================================================= */}

        <View style={styles.intro}>
          <Text style={styles.introRed}>
            WHAT'S
          </Text>

          <Text style={styles.introWhite}>
            HAPPENING?
          </Text>

          <Text style={styles.introDescription}>
            Stay up to date with the latest stories
            from your community and beyond.
          </Text>
        </View>

        {/* =================================================
            CATEGORY FILTER
        ================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={
            styles.categoryContainer
          }
        >
          <CategoryButton
            label="ALL"
            active={category === 'ALL'}
            onPress={() => setCategory('ALL')}
          />

          <CategoryButton
            label="LOCAL"
            active={category === 'LOCAL'}
            onPress={() => setCategory('LOCAL')}
          />

          <CategoryButton
            label="NATIONAL"
            active={category === 'NATIONAL'}
            onPress={() => setCategory('NATIONAL')}
          />

          <CategoryButton
            label="SPORT"
            active={category === 'SPORT'}
            onPress={() => setCategory('SPORT')}
          />
        </ScrollView>

        {/* =================================================
            FEATURED STORY
        ================================================= */}

        <SectionHeader
          number="01"
          title="TOP STORY"
        />

        {featuredPost ? (
          <FeaturedNewsCard
            post={featuredPost}
            imageUrl={imageUrl(
              featuredPost.image
            )}
          />
        ) : (
          <EmptyState text="No stories available in this category." />
        )}

        {/* =================================================
            MORE STORIES
        ================================================= */}

        {remainingPosts.length > 0 && (
          <>
            <SectionHeader
              number="02"
              title="MORE STORIES"
            />

            <View style={styles.newsList}>
              {remainingPosts.map((post) => (
                <NewsRow
                  key={post.id}
                  post={post}
                  imageUrl={imageUrl(post.image)}
                />
              ))}
            </View>
          </>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredPosts.length === 0 && (
          <View style={styles.noStories}>
            <Text style={styles.noStoriesIcon}>
              —
            </Text>

            <Text style={styles.noStoriesTitle}>
              NO STORIES
            </Text>

            <Text style={styles.noStoriesText}>
              There are currently no published
              stories in this category.
            </Text>

            <TouchableOpacity
              style={styles.allStoriesButton}
              onPress={() => setCategory('ALL')}
            >
              <Text
                style={styles.allStoriesButtonText}
              >
                VIEW ALL NEWS
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =================================================
            COMMUNITY
        ================================================= */}

        <View style={styles.communityCard}>
          <Text style={styles.communitySmall}>
            OPENMICFM
          </Text>

          <Text style={styles.communityTitle}>
            YOUR COMMUNITY.
          </Text>

          <Text style={styles.communityTitleRed}>
            YOUR VOICE.
          </Text>

          <Text style={styles.communityText}>
            Have a story, event or announcement
            you want us to know about?
          </Text>

          <TouchableOpacity
            style={styles.communityButton}
          >
            <Text style={styles.communityButtonText}>
              CONTACT US →
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

          <Text style={styles.footerLocation}>
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
   CATEGORY BUTTON
========================================================= */

function CategoryButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.categoryButton,
        active && styles.categoryButtonActive,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          active && styles.categoryTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   FEATURED NEWS
========================================================= */

function FeaturedNewsCard({
  post,
  imageUrl,
}: {
  post: Post;
  imageUrl: string | null;
}) {
  return (
    <View style={styles.featuredCard}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.featuredPlaceholder}>
          <Text style={styles.placeholderText}>
            OPENMICFM
          </Text>
        </View>
      )}

      <View style={styles.featuredContent}>
        <Text style={styles.featuredType}>
          {post.type?.toUpperCase() || 'NEWS'}
        </Text>

        <Text style={styles.featuredTitle}>
          {post.title}
        </Text>

        {post.excerpt ? (
          <Text
            style={styles.featuredExcerpt}
            numberOfLines={3}
          >
            {post.excerpt}
          </Text>
        ) : null}

        <View style={styles.featuredBottom}>
          <Text style={styles.readStory}>
            READ STORY →
          </Text>
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   NEWS ROW
========================================================= */

function NewsRow({
  post,
  imageUrl,
}: {
  post: Post;
  imageUrl: string | null;
}) {
  return (
    <View style={styles.newsRow}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.newsImagePlaceholder}>
          <Text style={styles.newsPlaceholderText}>
            OM
          </Text>
        </View>
      )}

      <View style={styles.newsInfo}>
        <Text style={styles.newsType}>
          {post.type?.toUpperCase() || 'NEWS'}
        </Text>

        <Text
          style={styles.newsTitle}
          numberOfLines={3}
        >
          {post.title}
        </Text>

        {post.excerpt ? (
          <Text
            style={styles.newsExcerpt}
            numberOfLines={1}
          >
            {post.excerpt}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <Text style={styles.sectionNumber}>
          {number}
        </Text>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      </View>

      <View style={styles.sectionLine} />
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
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

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

  backText: {
    color: WHITE,
    fontSize: 28,
    lineHeight: 28,
  },

  headerText: {
    flex: 1,
  },

  headerSmall: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },

  headerTitle: {
    color: WHITE,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 2,
  },

  newsBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  newsBadgeText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '900',
  },

  /* INTRO */

  intro: {
    marginBottom: 22,
  },

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

  /* CATEGORIES */

  categoryScroll: {
    marginHorizontal: -18,
  },

  categoryContainer: {
    paddingHorizontal: 18,
    gap: 8,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  categoryButtonActive: {
    backgroundColor: RED,
    borderColor: RED,
  },

  categoryText: {
    color: GREY,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  categoryTextActive: {
    color: WHITE,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 31,
    marginBottom: 12,
  },

  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionNumber: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    marginRight: 9,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 19,
    fontWeight: '900',
  },

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

  featuredImage: {
    width: '100%',
    height: 185,
    backgroundColor: SURFACE_LIGHT,
  },

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

  featuredContent: {
    padding: 17,
  },

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

  /* NEWS LIST */

  newsList: {
    gap: 9,
  },

  newsRow: {
    flexDirection: 'row',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    minHeight: 100,
    overflow: 'hidden',
  },

  newsImage: {
    width: 105,
    height: 100,
    backgroundColor: SURFACE_LIGHT,
  },

  newsImagePlaceholder: {
    width: 105,
    height: 100,
    backgroundColor: RED_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  newsPlaceholderText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '900',
  },

  newsInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },

  newsType: {
    color: YELLOW,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  newsTitle: {
    color: WHITE,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
  },

  newsExcerpt: {
    color: GREY,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 5,
  },

  /* COMMUNITY */

  communityCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginTop: 34,
  },

  communitySmall: {
    color: YELLOW,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  communityTitle: {
    color: WHITE,
    fontSize: 27,
    lineHeight: 29,
    fontWeight: '900',
    marginTop: 12,
  },

  communityTitleRed: {
    color: RED,
    fontSize: 27,
    lineHeight: 29,
    fontWeight: '900',
  },

  communityText: {
    color: GREY,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  communityButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: RED,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginTop: 18,
  },

  communityButtonText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
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

  noStories: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
  },

  noStoriesIcon: {
    color: RED,
    fontSize: 30,
    fontWeight: '900',
  },

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

  allStoriesButton: {
    backgroundColor: RED,
    paddingVertical: 11,
    paddingHorizontal: 15,
    marginTop: 17,
  },

  allStoriesButtonText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
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

  errorText: {
    color: GREY,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
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

  /* FOOTER */

  footer: {
    alignItems: 'center',
    paddingVertical: 38,
  },

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

  footerLocation: {
    color: '#555555',
    fontSize: 7,
    marginTop: 10,
  },

  bottomSpace: {
    height: 65,
  },

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

  loadingLogoText: {
    color: WHITE,
    fontSize: 23,
    fontWeight: '900',
  },

  loadingText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 14,
  },

  loadingSubtext: {
    color: GREY,
    fontSize: 10,
    marginTop: 6,
  },
});