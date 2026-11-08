import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AppState, Platform } from 'react-native';

const API_URL =
  'https://openmicfm-dxcvewf4arf0djd0.southafricanorth-01.azurewebsites.net';
const ENABLED_KEY = 'openmicfm.notifications.enabled';
const SNAPSHOTS_KEY = 'openmicfm.notifications.snapshots';
const POLL_INTERVAL_MS = 15 * 60 * 1000;
const SHOW_REMINDER_PREFIX = 'openmicfm-show-reminder-';
const MAX_SCHEDULED_SHOW_REMINDERS = 40;

type ContentItem = {
  id?: string | number;
  title?: string;
  name?: string;
  artist?: string;
  type?: string;
  created_at?: string;
  days_of_week?: string[];
  day_of_week?: string;
  show_dates?: string[];
  start_time?: string;
  presenter?: string;
};

type Snapshots = {
  songs: string[];
  posts: string[];
};

const EMPTY_SNAPSHOTS: Snapshots = { songs: [], posts: [] };
let syncInProgress = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function fetchItems(path: string): Promise<ContentItem[]> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Notification content request failed (${response.status}): ${path}`);
  }

  const body: unknown = await response.json();
  const values = Array.isArray(body)
    ? body
    : body && typeof body === 'object'
      ? Object.values(body).find(Array.isArray)
      : undefined;

  if (!Array.isArray(values)) {
    throw new Error(`Notification content response was not a list: ${path}`);
  }

  return values.filter(
    (item): item is ContentItem => item !== null && typeof item === 'object'
  );
}

function itemKey(item: ContentItem): string | null {
  if (typeof item.id === 'string' || typeof item.id === 'number') {
    return String(item.id);
  }

  return null;
}

async function readSnapshots(): Promise<Snapshots> {
  const serialized = await AsyncStorage.getItem(SNAPSHOTS_KEY);
  if (!serialized) return EMPTY_SNAPSHOTS;

  const parsed: unknown = JSON.parse(serialized);
  if (!parsed || typeof parsed !== 'object') return EMPTY_SNAPSHOTS;

  const snapshots = parsed as Partial<Snapshots>;
  return {
    songs: Array.isArray(snapshots.songs) ? snapshots.songs : [],
    posts: Array.isArray(snapshots.posts) ? snapshots.posts : [],
  };
}

function showStartDate(show: ContentItem, dateValue: string): Date | null {
  const time = typeof show.start_time === 'string' ? show.start_time : '';
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!timeMatch) return null;

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateValue);
  if (!dateMatch) return null;

  const date = new Date(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2])
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function getShowOccurrences(show: ContentItem): Date[] {
  const occurrences: Date[] = [];
  const today = new Date();
  const dates = Array.isArray(show.show_dates) ? show.show_dates : [];

  for (const dateValue of dates) {
    if (typeof dateValue !== 'string') continue;
    const start = showStartDate(show, dateValue);
    if (start && start.getTime() > Date.now()) occurrences.push(start);
  }

  if (occurrences.length > 0) return occurrences;

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const configuredDays = Array.isArray(show.days_of_week) && show.days_of_week.length > 0
    ? show.days_of_week
    : typeof show.day_of_week === 'string'
      ? [show.day_of_week]
      : [];
  const matchingDays = new Set(
    configuredDays
      .map((day) => dayNames.findIndex((name) => name === day.slice(0, 3).toLowerCase()))
      .filter((dayIndex) => dayIndex >= 0)
  );
  const time = typeof show.start_time === 'string' ? show.start_time : '';
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!timeMatch || matchingDays.size === 0) return occurrences;

  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    candidate.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
    if (
      matchingDays.has(candidate.getDay()) &&
      candidate.getTime() - Date.now() > 15 * 60 * 1000
    ) {
      occurrences.push(candidate);
    }
  }

  return occurrences;
}

async function scheduleShowReminders(shows: ContentItem[]): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((notification) => notification.identifier.startsWith(SHOW_REMINDER_PREFIX))
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );

  const now = Date.now();
  const reminders = shows.flatMap((show) => {
    const key = itemKey(show);
    const title = show.title || show.name;
    if (!key || !title) return [];

    return getShowOccurrences(show)
      .map((startsAt) => ({
        key: `${SHOW_REMINDER_PREFIX}${key}-${startsAt.getTime()}`,
        title,
        presenter: show.presenter,
        triggerAt: startsAt.getTime() - 15 * 60 * 1000,
      }))
      .filter((reminder) => reminder.triggerAt > now)
      .map((reminder) => ({ ...reminder, showId: key }));
  });

  for (const reminder of reminders.slice(0, MAX_SCHEDULED_SHOW_REMINDERS)) {
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.key,
      content: {
        title: `Coming up: ${reminder.title}`,
        body: reminder.presenter
          ? `${reminder.title} with ${reminder.presenter} starts in 15 minutes.`
          : `${reminder.title} starts in 15 minutes.`,
        data: { kind: 'show-reminder', showId: reminder.showId },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(reminder.triggerAt),
      },
    });
  }
}

async function notifyNewItems(
  kind: 'song' | 'news',
  items: ContentItem[],
  previousIds: Set<string>
): Promise<string[]> {
  const currentIds: string[] = [];
  const newItems: ContentItem[] = [];

  for (const item of items) {
    const key = itemKey(item);
    if (!key) continue;
    currentIds.push(key);
    if (!previousIds.has(key)) newItems.push(item);
  }

  if (newItems.length > 0) {
    const item = newItems[0];
    const title = item.title || 'New OpenMicFM update';
    const body =
      kind === 'song'
        ? `${title}${item.artist ? ` by ${item.artist}` : ''} is now on OpenMicFM.`
        : `${title} has just been published.`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: kind === 'song' ? 'New song added' : 'New OpenMicFM story',
        body:
          newItems.length > 1
            ? `${body} Plus ${newItems.length - 1} more new ${kind === 'song' ? 'songs' : 'stories'}.`
            : body,
        data: { kind, itemId: itemKey(item) },
        sound: 'default',
      },
      trigger: null,
    });
  }

  return currentIds;
}

async function syncContent(isInitial: boolean): Promise<void> {
  if (syncInProgress || Platform.OS === 'web') return;
  syncInProgress = true;

  try {
    const [songs, posts, shows] = await Promise.all([
      fetchItems('/api/songs?public=1'),
      fetchItems('/api/posts?status=Published'),
      fetchItems('/api/shows'),
    ]);

    const snapshots = await readSnapshots();
    const nextSongs = await notifyNewItems(
      'song',
      songs,
      new Set(isInitial ? songs.map(itemKey).filter((key): key is string => key !== null) : snapshots.songs)
    );
    const nextPosts = await notifyNewItems(
      'news',
      posts,
      new Set(isInitial ? posts.map(itemKey).filter((key): key is string => key !== null) : snapshots.posts)
    );

    await AsyncStorage.setItem(
      SNAPSHOTS_KEY,
      JSON.stringify({ songs: nextSongs, posts: nextPosts } satisfies Snapshots)
    );
    await scheduleShowReminders(shows);
  } finally {
    syncInProgress = false;
  }
}

export async function getLocalNotificationsEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(ENABLED_KEY)) === 'true';
}

export async function enableLocalNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Local notifications are available in the iOS and Android apps.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'OpenMicFM updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D71920',
    });
  }

  const currentPermission = await Notifications.getPermissionsAsync();
  const permission =
    currentPermission.granted || currentPermission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
      ? currentPermission
      : await Notifications.requestPermissionsAsync();

  if (!permission.granted && permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) {
    throw new Error('Notification permission was not granted. Enable it in your device settings to continue.');
  }

  await syncContent(true);
  await AsyncStorage.setItem(ENABLED_KEY, 'true');
}

export async function disableLocalNotifications(): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, 'false');
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((notification) => notification.identifier.startsWith(SHOW_REMINDER_PREFIX))
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );
}

export function startLocalNotificationSync(): () => void {
  const poll = async (initial: boolean) => {
    try {
      if (await getLocalNotificationsEnabled()) {
        await syncContent(initial);
      }
    } catch (error) {
      console.error('Local notification content sync failed:', error);
    }
  };

  void poll(false);

  const appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void poll(false);
    }
  });

  const interval = setInterval(() => {
    if (AppState.currentState === 'active') void poll(false);
  }, POLL_INTERVAL_MS);

  return () => {
    clearInterval(interval);
    appStateSubscription.remove();
  };
}
