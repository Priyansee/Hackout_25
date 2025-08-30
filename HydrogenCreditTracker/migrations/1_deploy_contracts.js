// File: migrations/1_deploy_contracts.js
const HydrogenCredit = artifacts.require("HydrogenCredit");

module.exports = function (deployer) {
  deployer.deploy(HydrogenCredit, "GreenHydrogenCredit", "GHC");
};
    