import { usePathname, useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppContext } from '../context/app-context';

type AppRoute = '/' | '/news' | '/music' | '/shows' | '/more';

type NavItem = {
  icon: string;
  label: string;
  route: AppRoute;
};

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useAppContext();

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

  const handleNavigation = (route: AppRoute) => {
    router.push(route);
  };

  const isProfileRoute = pathname === '/profile';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      {items.map((item) => {
        const isActive =
          item.route === '/'
            ? pathname === '/'
            : item.route === '/more'
              ? pathname.startsWith('/more') || isProfileRoute
              : pathname.startsWith(item.route) ||
                (item.route === '/shows' && pathname.startsWith('/show/'));

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
                { color: isActive ? colors.red : colors.muted },
              ]}
            >
              {item.icon}
            </Text>

            <Text
              style={[
                styles.label,
                { color: isActive ? colors.text : colors.muted },
              ]}
            >
              {item.label}
            </Text>

            {isActive && (
              <View style={[styles.activeLine, { backgroundColor: colors.red }]} />
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

    borderTopWidth: 1,

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
    fontSize: 21,

    marginBottom: 4,
  },

  label: {
    fontSize: 7,

    fontWeight: '900',

    letterSpacing: 0.8,
  },

  activeLine: {
    position: 'absolute',

    bottom: 0,

    width: 25,
    height: 3,

    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});