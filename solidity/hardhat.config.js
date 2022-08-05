//require("@nomicfoundation/hardhat-toolbox");

require("@nomiclabs/hardhat-waffle");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  networks: {
    localhost: {
      gas: 2100000,
    },

    matic: {
      url: "https://polygon-rpc.com/",
      accounts: [""]        /// pk - NEVER CHECK IN
    },
  }
};
