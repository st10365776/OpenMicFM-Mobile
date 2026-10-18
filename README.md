# OpenMicFM Mobile

OpenMicFM Mobile is a React Native application for the OpenMicFM community radio station in Gqeberha, South Africa. It presents the station's top songs, published news and sport stories, and current show information using data from the OpenMicFM API.

The app is built with Expo SDK 57, React Native, TypeScript, and Expo Router. It targets iOS, Android, and the web.

## Features

- **Home:** Displays the top 10 visible songs, recent non-sport stories, recent sport stories, and the first show returned by the API.
- **News:** Lists published posts and filters them by All, Local, National, or Sport.
- **Sport:** Shows published sport stories and offers filters for common sports including rugby, football, cricket, and tennis.
- **Refresh and error handling:** Content screens support pull-to-refresh and show a retry action when the API cannot be reached.
- **Responsive targets:** Expo is configured to run the application on iOS, Android, and web.

## Requirements

- Node.js **22.13.x or newer**, as required by Expo SDK 57.
- npm (the repository includes `package-lock.json`).
- For device builds: Xcode and an iOS Simulator on macOS, or Android Studio and an Android emulator for Android.

See the [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) for SDK-specific setup and compatibility details.

## Getting Started

From the repository root, install the locked dependencies:

```sh
npm ci
```

Start the Expo development server:

```sh
npm start
```

Use the Expo CLI prompts to open the app in a simulator or connected device. The platform-specific scripts are also available:

```sh
npm run ios
npm run android
npm run web
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run ios` | Start Expo and open the iOS target. |
| `npm run android` | Start Expo and open the Android target. |
| `npm run web` | Start Expo for web. |
| `npm run lint` | Run Expo lint checks. |
| `npm run reset-project` | Run the configured project reset script. |

## Screens and Navigation

Expo Router maps files in `src/app` to application routes:

| Route | Screen | Behavior |
| --- | --- | --- |
| `/` | Home | Loads songs, posts, and shows. |
| `/news` | News | Loads published posts and filters by category. |
| `/sports` | Sport | Loads published sport posts and filters story text by sport. |

The shared bottom navigation component is in `src/components/bottom-nav.tsx`. Its current Music, Shows, and More items point to routes that are not present in `src/app` yet.

## Backend and Data

The app currently uses this API base URL, defined directly in the screen source files:

```text
https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net
```

The screens request the following endpoints:

| Request | Used by | Purpose |
| --- | --- | --- |
| `GET /api/songs?public=1` | Home | Loads public songs; hidden songs are excluded, songs are sorted by rank, and at most 10 are displayed. |
| `GET /api/posts?status=Published` | Home, News | Loads published posts. News can filter the results by post type. |
| `GET /api/posts?status=Published&type=Sport` | Sport | Loads published sport posts. |
| `GET /api/shows` | Home | Loads shows; the first result is used for the on-air panel. |

Responses may be a JSON array or an object containing the corresponding `songs`, `posts`, or `shows` array. Song entries use fields such as `id`, `rank`, `title`, `artist`, `image`, and `visible`. Posts use `id`, `type`, `title`, `excerpt`, `body`, `image`, `status`, and optional publication dates. Show entries use `name` or `title`, `presenter`, and optional schedule and image fields.

Relative image paths returned by the API are resolved against the API base URL; absolute HTTP(S) image URLs are used as provided. The API must be reachable from the device or browser running the app. If the backend URL changes, update the `API_URL` constants in `src/app/index.tsx`, `src/app/news.tsx`, and `src/app/sports.tsx`.

## Project Structure

```text
.
├── app.json                 # Expo app identity, platform and plugin configuration
├── assets/                  # App icons and image assets
├── src/
│   ├── app/
│   │   ├── _layout.tsx      # Expo Router root stack
│   │   ├── index.tsx        # Home screen
│   │   ├── news.tsx         # News screen
│   │   └── sports.tsx       # Sport screen
│   └── components/
│       └── bottom-nav.tsx   # Shared bottom navigation
├── package.json             # Dependencies and npm scripts
└── tsconfig.json            # Strict TypeScript configuration
```

## Current Limitations

- The Home screen's **Listen Now** control is visual only; audio playback is not implemented.
- The **Get in Touch** control is also visual only and does not currently open a contact action.
- Music, Shows, and More are shown in the bottom navigation, but their destination screens have not been added yet.
- The API base URL is duplicated in the screen files rather than configured through an environment variable.

## Expo Configuration

The application uses Expo Router as its entry point (`expo-router/entry`), enables typed routes and the React Compiler, and configures a static web output. When changing Expo or React Native dependencies, use the versioned [Expo SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/) and Expo's compatible dependency tooling to keep package versions aligned.

