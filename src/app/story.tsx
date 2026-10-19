import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import RenderHTML from 'react-native-render-html';

import BottomNav from '../components/bottom-nav';
import { useThemedStyles } from '../context/app-context';

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

type Post = {
  id: number;
  type: string;
  title: string;
  excerpt?: string;
  body?: string;
  image?: string;
  published_at?: string;
  created_at?: string;
};

function resolveImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
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

export default function StoryScreen() {
  const router = useRouter();
  const styles = useThemedStyles(baseStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadStory() {
      try {
        const response = await fetch(`${API_URL}/api/posts?status=Published`);
        if (!response.ok) throw new Error('Could not load this story.');

        const data = await response.json();
        const posts: Post[] = Array.isArray(data) ? data : data.posts || [];
        const selectedPost = posts.find((item) => String(item.id) === id);

        if (!selectedPost) throw new Error('This story is no longer available.');
        if (active) setPost(selectedPost);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load this story.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStory();
    return () => {
      active = false;
    };
  }, [id]);

  const image = resolveImageUrl(post?.image);
  const date = formatDate(post?.published_at || post?.created_at);

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
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/news'))}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSmall}>OPENMICFM</Text>
            <Text style={styles.headerTitle}>STORY</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={RED} size="large" />
            <Text style={styles.stateText}>LOADING STORY</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorTitle}>STORY UNAVAILABLE</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : post ? (
          <>
            {image ? (
              <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
            ) : null}
            <Text style={styles.category}>{post.type?.toUpperCase() || 'NEWS'}</Text>
            <Text style={styles.title}>{post.title}</Text>
            {date ? <Text style={styles.date}>{date}</Text> : null}
            {post.excerpt ? <Text style={styles.excerpt}>{post.excerpt}</Text> : null}
            <View style={styles.rule} />
            {post.body ? (
              <RenderHTML
                contentWidth={width - 36}
                source={{ html: post.body }}
                baseStyle={styles.articleBody}
                tagsStyles={articleTagStyles}
              />
            ) : (
              <Text style={styles.articleBody}>The full story is not available.</Text>
            )}
          </>
        ) : null}
        <View style={styles.bottomSpace} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const RED = '#D71920';
const YELLOW = '#FFD200';
const BLACK = '#000000';
const SURFACE = '#151515';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

const articleTagStyles = {
  p: { marginTop: 0, marginBottom: 18 },
  h1: { color: WHITE, fontSize: 25, fontWeight: '900' as const },
  h2: { color: WHITE, fontSize: 21, fontWeight: '900' as const },
  h3: { color: WHITE, fontSize: 18, fontWeight: '800' as const },
  a: { color: YELLOW },
  blockquote: { borderLeftColor: RED, borderLeftWidth: 3, paddingLeft: 14 },
};

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BLACK },
  scroll: { flex: 1 },
  content: { paddingTop: 55, paddingHorizontal: 18 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
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
  headerSmall: { color: RED, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: WHITE, fontSize: 24, fontWeight: '900', marginTop: 2 },
  heroImage: { width: '100%', height: 220, backgroundColor: SURFACE, marginBottom: 20 },
  category: { color: YELLOW, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 9 },
  title: { color: WHITE, fontSize: 29, lineHeight: 35, fontWeight: '900' },
  date: { color: GREY, fontSize: 11, marginTop: 12 },
  excerpt: { color: WHITE, fontSize: 15, lineHeight: 23, marginTop: 18 },
  rule: { height: 1, backgroundColor: BORDER, marginVertical: 22 },
  articleBody: { color: WHITE, fontSize: 15, lineHeight: 25 },
  stateBox: {
    minHeight: 180,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  stateText: { color: GREY, fontSize: 10, fontWeight: '900', marginTop: 12, letterSpacing: 1 },
  errorTitle: { color: WHITE, fontSize: 14, fontWeight: '900' },
  errorText: { color: GREY, fontSize: 12, textAlign: 'center', marginTop: 8 },
  bottomSpace: { height: 95 },
});

const styles = baseStyles;