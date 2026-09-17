import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* =========================================================
   OPENMIC FM COLOURS
========================================================= */

const RED = '#D71920';
const RED_DARK = '#A80F15';
const YELLOW = '#FFD200';
const BLACK = '#000000';
const DARK = '#0D0D0D';
const SURFACE = '#151515';
const SURFACE_LIGHT = '#1E1E1E';
const WHITE = '#FFFFFF';
const LIGHT = '#F5F5F5';
const GREY = '#929292';
const BORDER = '#292929';

/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            NAVBAR
        ================================================= */}

        <View style={styles.navbar}>
          <View>
            <Text style={styles.logo}>
              OpenMic<Text style={styles.logoFM}>FM</Text>
            </Text>

            <Text style={styles.logoTagline}>
              THE STATION WITH PROGRESS
            </Text>
          </View>

          <TouchableOpacity style={styles.liveBadge}>
            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              LIVE
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>
          <View style={styles.heroRedLine} />

          <Text style={styles.heroEyebrow}>
            OPENMIC FM
          </Text>

          <Text style={styles.heroTitle}>
            YOUR{' '}
            <Text style={styles.yellowText}>TRUSTED</Text>
            {'\n'}
            SOURCE OF
            {'\n'}
            LOCAL NEWS
            {'\n'}
            AND GREAT MUSIC
          </Text>

          <Text style={styles.heroDescription}>
            Stay connected with your community through
            local stories, great music and everything
            happening around you.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.listenButton}>
              <Text style={styles.listenButtonText}>
                ▶  LISTEN NOW
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>
                VIEW SHOWS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =================================================
            STATS
        ================================================= */}

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              10+
            </Text>

            <Text style={styles.statLabel}>
              YEARS OF{'\n'}RADIO
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              K+
            </Text>

            <Text style={styles.statLabel}>
              LISTENERS
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              24/7
            </Text>

            <Text style={styles.statLabel}>
              ON AIR
            </Text>
          </View>
        </View>

        {/* =================================================
            TOP 10 SONGS
        ================================================= */}

        <SectionHeader
          number="01"
          title="TOP 10 SONGS"
          action="VIEW ALL"
        />

        <Text style={styles.sectionSubtitle}>
          THE MOST PLAYED SONGS IN SA
        </Text>

        <View style={styles.songContainer}>
          <Song
            position="01"
            title="Top Song"
            artist="Artist Name"
          />

          <Song
            position="02"
            title="Second Song"
            artist="Artist Name"
          />

          <Song
            position="03"
            title="Third Song"
            artist="Artist Name"
          />

          <Song
            position="04"
            title="Fourth Song"
            artist="Artist Name"
          />

          <Song
            position="05"
            title="Fifth Song"
            artist="Artist Name"
          />
        </View>

        {/* =================================================
            NEWS
        ================================================= */}

        <SectionHeader
          number="02"
          title="YOUR TOP STORIES"
          action="MORE"
        />

        <TouchableOpacity style={styles.featuredStory}>
          <View style={styles.featuredImage}>
            <Text style={styles.imagePlaceholder}>
              NEWS IMAGE
            </Text>
          </View>

          <View style={styles.storyBody}>
            <View style={styles.categoryContainer}>
              <View style={styles.categoryDot} />

              <Text style={styles.category}>
                LOCAL NEWS
              </Text>
            </View>

            <Text style={styles.storyTitle}>
              Latest stories from your community
            </Text>

            <Text style={styles.storyDescription}>
              Discover the latest news, events and stories
              happening around Gqeberha.
            </Text>

            <Text style={styles.readMore}>
              READ STORY  →
            </Text>
          </View>
        </TouchableOpacity>

        {/* =================================================
            NEWS TABS
        ================================================= */}

        <View style={styles.newsTabs}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>
              LOCAL NEWS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>
              NATIONAL
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>
              SPORT
            </Text>
          </TouchableOpacity>
        </View>

        {/* NEWS CARDS */}

        <NewsCard
          category="LOCAL NEWS"
          title="What's happening in your community"
        />

        <NewsCard
          category="NATIONAL NEWS"
          title="The latest stories from South Africa"
        />

        <NewsCard
          category="SPORT"
          title="Latest sports news and updates"
        />

        {/* =================================================
            COMMUNITY
        ================================================= */}

        <View style={styles.communitySection}>
          <View style={styles.communityAccent} />

          <Text style={styles.communityEyebrow}>
            OPENMIC FM
          </Text>

          <Text style={styles.communityTitle}>
            JOIN OUR
            {'\n'}
            <Text style={styles.yellowText}>
              LISTENING COMMUNITY
            </Text>
          </Text>

          <Text style={styles.communityText}>
            Experience the local sounds and stories of
            Gqeberha. Your voice matters to us.
          </Text>

          <TouchableOpacity style={styles.communityButton}>
            <Text style={styles.communityButtonText}>
              LISTEN NOW  →
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            ON AIR
        ================================================= */}

        <SectionHeader
          number="03"
          title="ON AIR"
          action="SHOW SCHEDULE"
        />

        <View style={styles.onAirCard}>
          <View style={styles.onAirTop}>
            <View style={styles.onAirStatus}>
              <View style={styles.liveDot} />

              <Text style={styles.onAirStatusText}>
                CURRENTLY ON AIR
              </Text>
            </View>
          </View>

          <Text style={styles.onAirTitle}>
            OpenMic FM
          </Text>

          <Text style={styles.onAirSubtitle}>
            Your trusted source of local news
            and great music.
          </Text>

          <TouchableOpacity style={styles.bigPlayButton}>
            <Text style={styles.playIcon}>
              ▶
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            ADVERTISE
        ================================================= */}

        <View style={styles.advertiseCard}>
          <View style={styles.advertiseTop}>
            <Text style={styles.advertiseLabel}>
              FOR BUSINESSES
            </Text>

            <View style={styles.yellowBox}>
              <Text style={styles.yellowBoxText}>
                AD
              </Text>
            </View>
          </View>

          <Text style={styles.advertiseTitle}>
            ADVERTISE
            {'\n'}
            <Text style={styles.yellowText}>
              WITH US
            </Text>
          </Text>

          <Text style={styles.advertiseText}>
            Promote your business to OpenMic FM
            listeners through our advertising packages.
          </Text>

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>
              VIEW RATE CARD  →
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            RECENT HIGHLIGHTS
        ================================================= */}

        <SectionHeader
          number="04"
          title="RECENT HIGHLIGHTS"
          action="VIEW ALL"
        />

        <View style={styles.highlightsGrid}>
          <Highlight title="OpenMic FM" />
          <Highlight title="Community" />
          <Highlight title="Local Stories" />
          <Highlight title="Great Music" />
        </View>

        {/* =================================================
            CONTACT / FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            OpenMic<Text style={styles.logoFM}>FM</Text>
          </Text>

          <Text style={styles.footerTagline}>
            THE STATION WITH PROGRESS
          </Text>

          <View style={styles.footerLine} />

          <Text style={styles.footerContact}>
            info@openmicfm.co.za
          </Text>

          <Text style={styles.footerContact}>
            +27 41 464 4471
          </Text>

          <Text style={styles.footerContact}>
            Pier 14 Shopping Mall
          </Text>

          <Text style={styles.footerContact}>
            Nelson Mandela Bay, South Africa
          </Text>

          <Text style={styles.copyright}>
            © 2026 OpenMic FM
          </Text>
        </View>
      </ScrollView>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      <View style={styles.bottomNav}>
        <NavItem
          icon="⌂"
          label="HOME"
          active
        />

        <NavItem
          icon="▤"
          label="NEWS"
        />

        <NavItem
          icon="♪"
          label="MUSIC"
        />

        <NavItem
          icon="◉"
          label="SHOWS"
        />

        <NavItem
          icon="☰"
          label="MORE"
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  title,
  action,
}: {
  number: string;
  title: string;
  action: string;
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

      <TouchableOpacity>
        <Text style={styles.sectionAction}>
          {action} →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   SONG
========================================================= */

function Song({
  position,
  title,
  artist,
}: {
  position: string;
  title: string;
  artist: string;
}) {
  return (
    <TouchableOpacity style={styles.song}>
      <Text style={styles.songPosition}>
        {position}
      </Text>

      <View style={styles.songImage}>
        <Text style={styles.musicIcon}>
          ♪
        </Text>
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>
          {title}
        </Text>

        <Text style={styles.songArtist}>
          {artist}
        </Text>
      </View>

      <Text style={styles.songArrow}>
        →
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   NEWS CARD
========================================================= */

function NewsCard({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <TouchableOpacity style={styles.newsCard}>
      <View style={styles.newsImage}>
        <Text style={styles.imagePlaceholder}>
          IMAGE
        </Text>
      </View>

      <View style={styles.newsContent}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryDot} />

          <Text style={styles.category}>
            {category}
          </Text>
        </View>

        <Text style={styles.newsTitle}>
          {title}
        </Text>

        <Text style={styles.readMore}>
          READ MORE →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   HIGHLIGHT
========================================================= */

function Highlight({
  title,
}: {
  title: string;
}) {
  return (
    <TouchableOpacity style={styles.highlight}>
      <View style={styles.highlightImage}>
        <Text style={styles.imagePlaceholder}>
          IMAGE
        </Text>
      </View>

      <Text style={styles.highlightTitle}>
        {title}
      </Text>

      <Text style={styles.highlightArrow}>
        →
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <Text
        style={[
          styles.navIcon,
          active && styles.navIconActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },

  scrollContent: {
    paddingBottom: 110,
  },

  /* =========================
     NAVBAR
  ========================= */

  navbar: {
    minHeight: 82,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BLACK,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    color: WHITE,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  logoFM: {
    color: RED,
  },

  logoTagline: {
    color: GREY,
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: WHITE,
    marginRight: 7,
  },

  liveText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* =========================
     HERO
  ========================= */

  hero: {
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 38,
    backgroundColor: BLACK,
  },

  heroRedLine: {
    width: 45,
    height: 5,
    backgroundColor: RED,
    marginBottom: 18,
  },

  heroEyebrow: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 18,
  },

  heroTitle: {
    color: WHITE,
    fontSize: 42,
    lineHeight: 43,
    fontWeight: '900',
    letterSpacing: -1.8,
  },

  yellowText: {
    color: YELLOW,
  },

  heroDescription: {
    color: GREY,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 22,
    maxWidth: 370,
  },

  heroButtons: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 10,
  },

  listenButton: {
    backgroundColor: RED,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 4,
  },

  listenButtonText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  scheduleButton: {
    borderWidth: 1,
    borderColor: WHITE,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 4,
  },

  scheduleButtonText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  /* =========================
     STATS
  ========================= */

  statsContainer: {
    backgroundColor: RED,
    minHeight: 105,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    color: WHITE,
    fontSize: 27,
    fontWeight: '900',
  },

  statLabel: {
    color: WHITE,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  /* =========================
     SECTION HEADER
  ========================= */

  sectionHeader: {
    marginTop: 42,
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sectionNumber: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
    marginRight: 10,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  sectionAction: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  sectionSubtitle: {
    color: GREY,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.3,
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  /* =========================
     SONGS
  ========================= */

  songContainer: {
    marginHorizontal: 20,
    backgroundColor: SURFACE,
    borderRadius: 6,
    overflow: 'hidden',
  },

  song: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  songPosition: {
    color: YELLOW,
    width: 32,
    fontSize: 11,
    fontWeight: '900',
  },

  songImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: SURFACE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  musicIcon: {
    color: RED,
    fontSize: 23,
    fontWeight: '900',
  },

  songInfo: {
    flex: 1,
    marginLeft: 12,
  },

  songTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '800',
  },

  songArtist: {
    color: GREY,
    fontSize: 11,
    marginTop: 3,
  },

  songArrow: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: '700',
  },

  /* =========================
     FEATURED STORY
  ========================= */

  featuredStory: {
    marginHorizontal: 20,
    backgroundColor: SURFACE,
    borderRadius: 7,
    overflow: 'hidden',
  },

  featuredImage: {
    height: 190,
    backgroundColor: SURFACE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePlaceholder: {
    color: '#555555',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  storyBody: {
    padding: 18,
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: RED,
    marginRight: 7,
  },

  category: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  storyTitle: {
    color: WHITE,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '900',
  },

  storyDescription: {
    color: GREY,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  readMore: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 15,
  },

  /* =========================
     NEWS TABS
  ========================= */

  newsTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  activeTab: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderBottomWidth: 3,
    borderBottomColor: RED,
  },

  activeTabText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '900',
  },

  inactiveTab: {
    paddingVertical: 12,
    paddingHorizontal: 13,
  },

  inactiveTabText: {
    color: GREY,
    fontSize: 9,
    fontWeight: '900',
  },

  /* =========================
     NEWS CARD
  ========================= */

  newsCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: SURFACE,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 125,
  },

  newsImage: {
    width: 125,
    backgroundColor: SURFACE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  newsContent: {
    flex: 1,
    padding: 13,
  },

  newsTitle: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },

  /* =========================
     COMMUNITY
  ========================= */

  communitySection: {
    marginTop: 45,
    marginHorizontal: 20,
    backgroundColor: RED,
    padding: 25,
    borderRadius: 7,
    overflow: 'hidden',
  },

  communityAccent: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: RED_DARK,
  },

  communityEyebrow: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 13,
  },

  communityTitle: {
    color: WHITE,
    fontSize: 28,
    lineHeight: 31,
    fontWeight: '900',
  },

  communityText: {
    color: WHITE,
    opacity: 0.85,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 15,
  },

  communityButton: {
    alignSelf: 'flex-start',
    backgroundColor: YELLOW,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 4,
    marginTop: 22,
  },

  communityButtonText: {
    color: BLACK,
    fontSize: 10,
    fontWeight: '900',
  },

  /* =========================
     ON AIR
  ========================= */

  onAirCard: {
    marginHorizontal: 20,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 7,
    padding: 20,
  },

  onAirTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  onAirStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onAirStatusText: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  onAirTitle: {
    color: WHITE,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 22,
  },

  onAirSubtitle: {
    color: GREY,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 260,
  },

  bigPlayButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playIcon: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 3,
  },

  /* =========================
     ADVERTISE
  ========================= */

  advertiseCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: WHITE,
    padding: 25,
    borderRadius: 7,
  },

  advertiseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  advertiseLabel: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  yellowBox: {
    width: 38,
    height: 38,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  yellowBoxText: {
    color: BLACK,
    fontSize: 12,
    fontWeight: '900',
  },

  advertiseTitle: {
    color: BLACK,
    fontSize: 31,
    lineHeight: 33,
    fontWeight: '900',
    marginTop: 20,
  },

  advertiseText: {
    color: '#555555',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  outlineButton: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: BLACK,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 20,
  },

  outlineButtonText: {
    color: BLACK,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  /* =========================
     HIGHLIGHTS
  ========================= */

  highlightsGrid: {
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  highlight: {
    width: '48%',
    backgroundColor: SURFACE,
    borderRadius: 6,
    overflow: 'hidden',
    paddingBottom: 12,
  },

  highlightImage: {
    height: 105,
    backgroundColor: SURFACE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  highlightTitle: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  highlightArrow: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: '900',
    paddingHorizontal: 12,
    marginTop: 5,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    marginTop: 55,
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 25,
    backgroundColor: DARK,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  footerLogo: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '900',
  },

  footerTagline: {
    color: GREY,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginTop: 3,
  },

  footerLine: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 22,
  },

  footerContact: {
    color: GREY,
    fontSize: 12,
    marginBottom: 7,
  },

  copyright: {
    color: '#555555',
    fontSize: 10,
    marginTop: 25,
  },

  /* =========================
     BOTTOM NAV
  ========================= */

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: BLACK,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  navIcon: {
    color: GREY,
    fontSize: 20,
    marginBottom: 4,
  },

  navIconActive: {
    color: RED,
  },

  navLabel: {
    color: GREY,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  navLabelActive: {
    color: WHITE,
  },
});