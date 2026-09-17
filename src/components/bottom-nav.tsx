import { usePathname, useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const RED = '#D71920';
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const GREY = '#929292';
const BORDER = '#292929';

type NavItem = {
  icon: string;
  label: string;
  route: string;
};

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const items: NavItem[] = [
    {
      icon: '⌂',
      label: 'HOME',
      route: '/',
    },
    {
      icon: '▤',
      label: 'NEWS',
      route: '/news',
    },
    {
      icon: '♪',
      label: 'MUSIC',
      route: '/music',
    },
    {
      icon: '◉',
      label: 'SHOWS',
      route: '/shows',
    },
    {
      icon: '☰',
      label: 'MORE',
      route: '/more',
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive =
          item.route === '/'
            ? pathname === '/'
            : pathname.startsWith(item.route);

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation(item.route)}
          >
            <Text
              style={[
                styles.icon,
                isActive && styles.activeIcon,
              ]}
            >
              {item.icon}
            </Text>

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>

            {isActive && (
              <View style={styles.activeLine} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    height: 72,

    backgroundColor: BLACK,

    borderTopWidth: 1,
    borderTopColor: BORDER,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    paddingBottom: 4,

    zIndex: 100,
    elevation: 10,
  },

  navItem: {
    flex: 1,

    height: 72,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  icon: {
    color: GREY,

    fontSize: 21,

    marginBottom: 4,
  },

  activeIcon: {
    color: RED,
  },

  label: {
    color: GREY,

    fontSize: 7,

    fontWeight: '900',

    letterSpacing: 0.8,
  },

  activeLabel: {
    color: WHITE,
  },

  activeLine: {
    position: 'absolute',

    bottom: 0,

    width: 25,
    height: 3,

    backgroundColor: RED,

    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});