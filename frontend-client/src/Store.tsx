import React from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import EthTw33t from './contracts/EthTw33t.json';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
type Action =
  | {
    type: 'loadContract';
    payload: any;
  }
  | {
    type: 'loadUser';
    payload: any;
  };
type Dispatch = (action: Action) => void;
type State = {
  web3: Web3 | null;
  contract: Contract | null;
  tweets: { author: string; message: string; retweet: boolean }[];
  handle: string | null;
  registered: boolean;
};
type Web3ProviderProps = { children: React.ReactNode };
const Web3Context = React.createContext<State | undefined>(undefined);
const Web3DispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);
function web3Reducer(state: State, action: Action) {
  const actionType = action.type;
  switch (actionType) {
    case 'loadContract': {
      return {
        ...state,
        web3: action.payload.web3,
        contract: action.payload.contract,
        handle: action.payload.handle,
        registered: action.payload.registered
      };
    }
    case 'loadUser': {
      return {
        ...state,
        handle: action.payload.name,
        registered: action.payload.isReg
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${actionType}`);
    }
  }
}
function Web3Provider({ children }: Web3ProviderProps) {
  const [state, dispatch] = React.useReducer(web3Reducer, {
    web3: null,
    contract: null,
    tweets: [],
    handle: null,
    registered: false
  });
  return (
    <Web3Context.Provider value={state}>
      <Web3DispatchContext.Provider value={dispatch}>
        {children}
      </Web3DispatchContext.Provider>
    </Web3Context.Provider>
  );
}
function useWeb3State() {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}
function useWeb3Dispatch() {
  const context = React.useContext(Web3DispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

const loadWeb3 = async (): Promise<Web3> => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  // Modern dapp browsers...
  if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
    const web3 = new Web3(window.ethereum);
    // Request account access if needed
    await window.ethereum.enable();
    // Acccounts now exposed
    return web3;
  }
  // Legacy dapp browsers...
  if (window.web3) {
    // Use Mist/MetaMask's provider.
    const { web3 } = window;
    console.log('Injected web3 detected.');
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  const web3 = new Web3(provider);
  console.log('No web3 instance injected, using Local web3.');
  return web3;
};
async function loadContract(dispatch: Dispatch) {
  const web3 = await loadWeb3();
  if (web3) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const network = await web3.eth.net.getId();
    const deployedAddress = EthTw33t.networks[network].address;
    const { abi } = EthTw33t;
    const contract = new web3.eth.Contract(
      (abi as unknown) as AbiItem,
      deployedAddress,
      {
        from: account
      }
    );
    let registered = false;
    registered = await contract.methods.isRegUser().call();
    let handle = null;
    if (registered) {
      handle = await contract.methods
        .addressUserName(contract.options.from)
        .call();
    }
    let tweetsNumber = 0;
    tweetsNumber = await contract.methods.nTweets().call();
    const upperIndexRange = tweetsNumber - 1 >= 0 ? tweetsNumber : 0;
    const lowerIndexRange = (tweetsNumber - 5) >= 0 ? tweetsNumber - 5 : 
      0;
    const tweets = [];
    for (let i = upperIndexRange; i >= lowerIndexRange;i-=1) {
      const tweet = await contract.methods.tweets().call(i);
      tweets.push(tweet);
    }
    console.log(tweets);
    dispatch({
      type: 'loadContract',
      payload: { web3, contract, registered, handle }
    });
  }
}

async function loadUser(state: State, dispatch: Dispatch) {
  const { contract } = state;
  if (contract) {
    let isReg = false;
    isReg = await contract.methods.isRegUser().call();
    let name = null;
    if (isReg) {
      name = await contract.methods
        .addressUserName(contract.options.from)
        .call();
    }
    dispatch({ type: 'loadUser', payload: { name, isReg } });
  }
}

export { Web3Provider, useWeb3State, useWeb3Dispatch, loadContract, loadUser };
