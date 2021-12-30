export const environment = {
  production: true,
  mainnetDefault: true,
  mainnet: {
    tokens: {
      cat: '0xcdc17669ce3b7cfa65a29c4941aba14dbff9b12b',
      gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
      flm: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
      fusdt: '0xcd48b160c1bbc9d74997b803b9a7ad50a4bef020',
      bneo: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
    },
    wcaContractHash: '0x1312460889ef976db3561e7688b077f09d5e98e0',
    nodeUrl: 'https://neo3-mainnet.neoline.vip:443',
    devFeeAddress: 'NWWpkYtqeUwgHfbFMZurmKei6T85JtA1HQ',
    neotube: 'https://neo3.neotube.io/transaction/',
  },
  testnet: {
    tokens: {
      cat: '0xf461dff74f454e5016421341f115a2e789eadbd7',
      gas: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
      flm: '0x1415ab3b409a95555b77bc4ab6a7d9d7be0eddbd',
      fusdt: '0x83c442b5dc4ee0ed0e5249352fa7c75f65d6bfd6',
      bneo: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
    },
    wcaContractHash: '0x3d151c524c35ea5cd549323d98e782cfb7403951',
    nodeUrl: 'https://neo3-testnet.neoline.vip:443',
    devFeeAddress: 'NSjnxcxV6qXGFLbo1vSAsSqRjBiyB6Qz7V',
    neotube: 'https://neo3.testnet.neotube.io/transaction/',
  },
};
