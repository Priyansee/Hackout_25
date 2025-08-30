module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Change to 7545 if using Ganache GUI
      network_id: "*",       // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",   // 👈 set this to match your pragma
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
