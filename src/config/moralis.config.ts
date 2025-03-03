export const moralisConfig = {
  apiKey: process.env.MORALIS_API_KEY,
  chains: {
    ethereum: {
      id: '0x1',
      wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    polygon: {
      id: '0x89',
      wmaticAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    },
  },
}; 