# 🎙️ OpenMicFM Mobile

**Your community. Your stories. Your sound.**

OpenMicFM Mobile is a cross-platform mobile application for **OpenMicFM, a community radio station based in Gqeberha, South Africa**. The app brings music discovery, local and national news, sports coverage, and station programme information together in one digital experience.

Built with React Native, Expo, TypeScript, and Expo Router, the application connects to the OpenMicFM REST API to deliver station content across iOS, Android, and the web.

## ✨ Features

### 🏠 Home
- **Top 10 Songs:** Discover ranked songs with track titles, artists, and available artwork.
- **Latest News:** Explore recently published non-sport stories.
- **Sports Highlights:** Catch up on recent sports news.
- **On-Air Information:** View details about the first programme returned by the API.
- **Content Refresh:** Retrieve the latest available content from the backend.

### 📰 News
- Browse published news articles.
- Filter stories by All, Local, National, or Sport.
- View article titles, excerpts, and available images.
- Refresh content with pull-to-refresh.
- Retry requests when the API is unavailable.

### ⚽ Sports
- Browse published sports stories.
- Filter content by rugby, football, cricket, and tennis.
- Discover stories through their titles, excerpts, and images.
- Refresh the feed and retry failed requests.

*Sport-specific filters currently use text matching, so results depend on the wording of each story.*

### 📱 Cross-Platform Support
- iOS
- Android
- Web browsers

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform user interface |
| Expo SDK 57 | Application development and tooling |
| TypeScript | Type-safe development |
| Expo Router | File-based navigation |
| REST API | Backend communication and content delivery |
| Microsoft Azure | Backend API hosting |
| npm | Dependency management |

## 🔌 API Integration

The application retrieves content from the OpenMicFM REST API, providing a central source for songs, published articles, sports stories, and station programmes.

**API base URL:**

```text
https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net
```

### Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/songs?public=1` | Retrieves public songs for the Home screen |
| `GET /api/posts?status=Published` | Retrieves published articles |
| `GET /api/posts?status=Published&type=Sport` | Retrieves published sports stories |
| `GET /api/shows` | Retrieves station programme information |

The application supports JSON array responses and responses containing the corresponding `songs`, `posts`, or `shows` array.

Relative image paths are resolved against the API base URL, while absolute HTTP(S) image URLs are used directly.

## 🧭 Navigation

| Route | Screen |
|---|---|
| `/` | Home |
| `/news` | News |
| `/sports` | Sports |

The shared bottom navigation component is located in `src/components/bottom-nav.tsx`. Music, Shows, and More navigation items are present, with their destination screens planned for future development.

## 📂 Project Structure

```text
OpenMicFM-Mobile/
├── app.json
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── news.tsx
│   │   └── sports.tsx
│   └── components/
│       └── bottom-nav.tsx
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 🚀 Getting Started

**Requirements:** Node.js 22.13 or newer and npm.

```bash
npm ci
npm start
```

Run on a specific platform:

```bash
npm run ios
npm run android
npm run web
```

Run lint checks:

```bash
npm run lint
```

## 🗺️ Roadmap

- [ ] Integrate live radio streaming.
- [ ] Build a dedicated Music screen.
- [ ] Add programme schedules and presenter profiles.
- [ ] Implement full article detail screens.
- [ ] Enable direct contact with the station.
- [ ] Complete Music, Shows, and More navigation.
- [ ] Move API configuration into environment variables.
- [ ] Improve content discovery and filtering.

## 🔮 Vision

OpenMicFM Mobile aims to extend the station's reach beyond traditional broadcasting by making music, news, sports, and community content accessible through a single digital platform.

The project combines cross-platform mobile development with API-driven content delivery to create a foundation for a richer, more connected community radio experience.

---

**OpenMicFM Mobile — Connecting the community, one story and one song at a time.** 🎧

*Developed for OpenMicFM | Gqeberha, South Africa*
