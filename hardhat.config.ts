import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "solidity-coverage";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  namedAccounts: {
    owner: 0,
    admin: 1,
    user: 2,
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // arbitrum: {
    //   url: process.env.URL_ARBITRUM_RPC,
    //   accounts: [<string>process.env.ARBITRUM_TESTNET_PRIVATE_KEY],
    //   chainId: 421613,
    // },
  },
};

export default config;
