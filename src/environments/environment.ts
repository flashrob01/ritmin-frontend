// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  testNetWcaContractHash: '0x514e4dc6398ba12a8c3a5ed96187d606998c4d93',
  // testNetWcaContractHash: '0x3d151c524c35ea5cd549323d98e782cfb7403951',
  testNetCatTokenHash: '0xf461dff74f454e5016421341f115a2e789eadbd7',
  testNetFlamingoUsdtTokenHash: '0x83c442b5dc4ee0ed0e5249352fa7c75f65d6bfd6',
  testNetNodeUrl: 'https://neo3-testnet.neoline.vip:443',
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
