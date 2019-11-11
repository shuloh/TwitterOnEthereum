import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Web3 from "web3";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary
  }
}));
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
const Home: React.FC = () => {
  const classes = useStyles();
  const getWeb3 = async () => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // Modern dapp browsers...
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.ethereum.on("accountsChanged", () => {
        window.location.reload(true);
      });
      window.ethereum.on("networkChanged", () => {
        window.location.reload(true);
      });
      const web3 = new Web3(window.ethereum);
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      return web3;
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log("Injected web3 detected.");
      return web3;
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      const web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
      return web3;
    }
  };
  const connectWeb3 = async () => {
    try {
      const web3 = await getWeb3();
    } catch (error) {
      console.error(error);
    }
  };
  return null;
};

export default Tweets;
