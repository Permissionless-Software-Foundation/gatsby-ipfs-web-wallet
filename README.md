# gatsby-theme-bch-wallet

This repository is a Gatsby Theme. It can be accessed via the [gatsby-theme-bch-wallet npm package](https://www.npmjs.com/package/gatsby-theme-bch-wallet). It is used by the [bch-wallet-starter Gatsby Starter](https://github.com/Permissionless-Software-Foundation/bch-wallet-starter)

If you want to create your own BCH web wallet app, you should [start with the starter](https://github.com/Permissionless-Software-Foundation/bch-wallet-starter).

## Live Demos:

- [Demo of wallet boilerplate](https://demo-wallet.fullstack.cash)
- [Official FullStack.cash wallet](https://wallet.fullstack.cash)

## Background

This is a mobile-first Gatsby Theme that is [IPFS](https://ipfs.io)-ready. It integrates the [AdminLTE Dashboard React components](https://www.npmjs.com/package/adminlte-2-react) to create a dashboard. This app is built as a light-weight Bitcoin Cash (BCH) wallet. It can be forked and the BCH functionality can be leveraged for many different use cases, and to solve many different business problems.

## Installing a Dev Environment

Standard workflow for setting up a development environment for working on this repo:

- `git clone https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet`
- `cd gatsby-ipfs-web-wallet`
- `npm install`
- `npm start`

## Compiling Android App

Hooks are provided for compiling this code base into an Android App using [Capacitor](https://capacitorjs.com/). It's possible to use this code to also compile an iOS app, but it is untested. Here is the flow for building the Android app:

- Follow the instructions above to install the Dev Environment
- Download and install [Android Studio](https://developer.android.com/studio)
- Update the capacitor.config file with the route where Android studio is installed.
- `npm run build` (generates the public folder)
- `npm run android:setup` (generates the android folder)
- `npm run android:open` (opens the android studio with the project)
- Compile the APK with Android Studio.

Note: The `gcradle` and `sdk` versions must be compatible.

## License

[MIT](./LICENSE.md)
