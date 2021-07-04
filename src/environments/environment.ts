// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  chainId: 'neo3:testnet',
  wcaContractHash: '0xbb1b061b381ccbee925909709be2ef37ece3e6c8',
  catTokenHash: '0xf461dff74f454e5016421341f115a2e789eadbd7',
  walletConnectLogLevel: '',
  relayServer: 'wss://connect.coz.io:443', //wss://relay.walletconnect.org
  testNetUrl: 'https://testnet1.neo.coz.io:443',
  appVersion: require('../../package.json').version,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
