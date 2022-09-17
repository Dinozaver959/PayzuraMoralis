//require("@nomicfoundation/hardhat-toolbox");

require("@nomiclabs/hardhat-waffle");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  settings: {
    optimizer: {
      enabled: true,
      runs: 1,
    },
  },

  networks: {
    localhost: {
      gas: 2100000,
      allowUnlimitedContractSize: true,
    },

    hardhat:{
      //gas: 2100000,
      //allowUnlimitedContractSize: true,
    },
  }
};

/*
    matic: {
      url: "https://polygon-rpc.com/",
      accounts: [""]        /// pk - NEVER CHECK IN
    },
*/
