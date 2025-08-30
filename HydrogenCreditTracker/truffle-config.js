module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Ganache host
      port: 8545,            // Ganache CLI (or 7545 if Ganache GUI)
      network_id: "*",       // Match any network id
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",    // Fetch exact version from solc-bin
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },


  mocha: {
    timeout: 100000
  }
};
