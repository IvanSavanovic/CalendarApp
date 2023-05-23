# CalendarApp

## Packages:

- [@react-native-paper](https://callstack.github.io/react-native-paper/docs/guides/getting-started/)
- [react-native-vector-image](https://github.com/oblador/react-native-vector-image)
- [react-native-modal](https://github.com/react-native-modal/react-native-modal)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)

## Run Dev

To start Metro Bundler run:

- `npx react-native start`

Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder (root). Run the following:

- `npx react-native run-android`

Other option is to run one of commands in:

- root: `npx react-native run-android` or in
- /android: `npx react-native start`

## Run Build

You can also use the React Native CLI to generate and run a Release build:

- `npx react-native run-android --mode=release`

## Build

On Windows - first check [Android Users on New Architecture building on Windows](https://reactnative.dev/architecture/bundled-hermes#android-users-on-new-architecture-building-on-windows).

### Steps:

Steps 1. and 2. needs to be done once for project.

1.  Make sure you have an assets folder under `android/app/src/main/assets`. If it's not there, create one.
2.  Then in `root`:
    - `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
3.  To build APK, in `/android`:
    - `./gradlew assembleRelease`

APK is located in `android/app/build/outputs/apk/app-release.apk`.

### Error:

If your build fails with the following errors:

- `Execution failed for task ':app:processReleaseResources'` or for `Execution failed for task ':app:mergeReleaseResources'` then in `android/app/src/main/res/` delete `drawable-mdpi` and run build again.
