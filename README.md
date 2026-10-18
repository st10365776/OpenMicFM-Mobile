# OpenMicFM Mobile 🎙️

**Your community. Your stories. Your sound.**

OpenMicFM Mobile is a cross-platform mobile application built for **OpenMicFM, a community radio station based in Gqeberha, South Africa**. The app brings the station's music, news, sports coverage, and show information into one accessible digital experience, keeping listeners connected to what's happening in their community.

Built with React Native, Expo, TypeScript, and Expo Router, the application connects to the OpenMicFM API to deliver published content directly to listeners across iOS, Android, and the web.

## About the App

OpenMicFM Mobile extends the OpenMicFM experience beyond traditional radio broadcasting. It gives listeners a central place to explore featured songs, catch up on the latest stories, follow sporting news, and discover station programming.

The application is designed around a simple, content-driven interface, with dedicated screens for music discovery, news, and sports. Content is retrieved from the station's backend, allowing the app to display the latest available information without maintaining a separate content catalogue.

## Features

### 🏠 Home — Your OpenMicFM Hub

The home screen brings together key content from across the station.

- **Top 10 Songs:** Discover the station's visible, ranked songs, including track titles, artists, and available artwork.
- **Latest News:** Catch up on recently published non-sport stories.
- **Sports Highlights:** Browse recent sports stories in a dedicated section.
- **On-Air Information:** View information about the first show returned by the station's API, including available presenter and programme details.
- **Content Refresh:** Reload the latest available content from the backend.

### 📰 News — Stay Informed

A dedicated news feed keeps listeners up to date with published stories.

- Browse published articles in one place.
- Filter stories by All, Local, National, or Sport.
- View article titles, excerpts, images, and other available publication details.
- Pull down to refresh the latest content.
- Retry loading content when the API is temporarily unavailable.

### ⚽ Sports — Follow the Action

The sports screen provides a focused experience for sports-related news.

- Browse published sports stories.
- Filter stories by common sporting categories, including rugby, football, cricket, and tennis.
- Discover stories through their available titles, excerpts, and images.
- Refresh the feed and retry failed requests.

Sport-specific filters use story text matching, so results depend on the wording of the available content.

### 📱 Cross-Platform Experience

OpenMicFM Mobile is designed to support:

- **iOS** — Apple mobile devices.
- **Android** — Android smartphones and tablets.
- **Web** — Browser-based access to the application.

The interface uses React Native components and Expo's cross-platform tooling to share application logic across supported platforms.

## App Screens

| Screen | Purpose |
|---|---|
| Home | Featured music, recent news, sports stories, and show information |
| News | Published articles with category filters |
| Sports | Sports coverage with sport-specific filters |
| Bottom Navigation | Shared navigation component for moving between app sections |

The current bottom navigation also includes Music, Shows, and More items. Their dedicated destination screens are planned but have not yet been implemented.

## Technology Stack

| Technology | Role |
|---|---|
| React Native | Cross-platform application interface |
| Expo SDK 57 | Development platform and native application tooling |
| TypeScript | Type-safe application development |
| Expo Router | File-based routing and screen navigation |
| REST API | Retrieves music, news, sports, and show data |
| Microsoft Azure | Hosts the OpenMicFM backend API |
| npm | Dependency and project script management |

## Backend Integration

OpenMicFM Mobile consumes the OpenMicFM REST API to retrieve its content. The backend acts as the central source of information for the application.

**Content currently integrated:**

- **Songs:** Retrieves public songs, excludes hidden entries, sorts by rank, and displays up to ten tracks.
- **Posts:** Retrieves published articles for the home and news screens.
- **Sports posts:** Retrieves published stories categorised as Sport.
- **Shows:** Retrieves station programme information for the home screen's on-air panel.

The app supports API responses returned either as JSON arrays or as objects containing the relevant `songs`, `posts`, or `shows` array.

Images can be supplied as absolute HTTP(S) URLs or relative paths resolved against the API's base URL.

The currently configured API endpoint is hosted on Microsoft Azure:

`https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net`

The application requires a reachable backend to retrieve live content.

## User Experience and Reliability

The app includes basic safeguards to make browsing more reliable:

- Loading and content-fetching states for API-driven screens.
- Pull-to-refresh support on content screens.
- Retry actions when requests fail.
- Shared bottom navigation for a consistent interface.
- Responsive platform support through Expo and React Native.

These features help the app handle temporary connectivity issues while keeping its content accessible whenever the API is available.

## Project Structure

```text
.
├── app.json
├── assets/
└── src/
    ├── app/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── news.tsx
    │   └── sports.tsx
    └── components/
        └── bottom-nav.tsx
```

- `src/app/index.tsx` — Home screen and featured content.
- `src/app/news.tsx` — News feed and category filtering.
- `src/app/sports.tsx` — Sports feed and sport-specific filtering.
- `src/app/_layout.tsx` — Root navigation layout.
- `src/components/bottom-nav.tsx` — Shared bottom navigation.
- `assets/` — Application icons and visual assets.
- `app.json` — Expo application configuration.

## Roadmap 🚀

Planned improvements include:

- **Live Radio Streaming:** Enable listeners to tune in directly through the app.
- **Music Screen:** Provide a dedicated space to explore station music and featured tracks.
- **Shows & Schedule:** Browse programmes, presenters, and broadcast times.
- **Article Details:** Add dedicated views for reading full news and sports stories.
- **Contact & Engagement:** Enable listeners to contact the station directly.
- **Improved Navigation:** Complete the Music, Shows, and More destinations.
- **Configuration Improvements:** Centralise API configuration through environment variables.
- **Enhanced Discovery:** Explore richer content browsing and improved filtering.

These improvements aim to develop OpenMicFM Mobile into a more complete digital companion to the station.

## Development

To run the application locally, install the project's locked dependencies and start the Expo development server:

```bash
npm ci
npm start
```

Additional scripts are available for running the supported platforms and performing code-quality checks:

```bash
npm run ios
npm run android
npm run web
npm run lint
```

## About OpenMicFM

OpenMicFM is a community radio initiative based in **Gqeberha, Eastern Cape, South Africa**. OpenMicFM Mobile supports the station's digital presence by bringing together music discovery, community news, sports coverage, and programme information in one cross-platform application.

**OpenMicFM Mobile — Connecting the community, one story and one song at a time.**
