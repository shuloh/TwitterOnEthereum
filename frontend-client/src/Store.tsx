import React from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import EthTw33t from './contracts/EthTw33t.json';

const MAX_TWEETS_PER_PAGE = 5;
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
    }
  | {
      type: 'loadTweets';
      payload: any;
    };
type Dispatch = (action: Action) => void;
type DispatchLoading = (action: boolean) => void;
type Tweet = {
  author: string;
  authorName: string;
  message: string;
  retweeted: boolean;
  retweetId: number;
  tweetId: number;
  nComments: number;
  comments: string[];
};
type State = {
  web3: Web3 | null;
  contract: Contract | null;
  nTweets: number;
  tweets: Tweet[];
  handle: string | null;
  registered: boolean;
};
type Web3ProviderProps = { children: React.ReactNode };
const LoadingContext = React.createContext<boolean | undefined>(undefined);
const LoadingDispatchContext = React.createContext<DispatchLoading | undefined>(
  undefined
);
const Web3Context = React.createContext<State | undefined>(undefined);
const Web3DispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);
function loadingReducer(state: boolean, action: boolean) {
  return action;
}
function web3Reducer(state: State, action: Action) {
  const actionType = action.type;
  switch (actionType) {
    case 'loadContract': {
      return {
        ...state,
        web3: action.payload.web3,
        contract: action.payload.contract,
        handle: action.payload.handle,
        registered: action.payload.registered,
        nTweets: action.payload.nTweets,
        tweets: action.payload.tweets
      };
    }
    case 'loadUser': {
      return {
        ...state,
        handle: action.payload.name,
        registered: action.payload.isReg
      };
    }
    case 'loadTweets': {
      return {
        ...state,
        tweets: action.payload.tweets,
        nTweets: action.payload.nTweets
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${actionType}`);
    }
  }
}
function LoadingProvider({ children }: Web3ProviderProps) {
  const [state, dispatch] = React.useReducer(loadingReducer, false);
  return (
    <LoadingContext.Provider value={state}>
      <LoadingDispatchContext.Provider value={dispatch}>
        {children}
      </LoadingDispatchContext.Provider>
    </LoadingContext.Provider>
  );
}
function Web3Provider({ children }: Web3ProviderProps) {
  const [state, dispatch] = React.useReducer(web3Reducer, {
    web3: null,
    contract: null,
    nTweets: 0,
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
function useLoadingState() {
  const context = React.useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('need Provider');
  }
  return context;
}
function useLoadingDispatch() {
  const context = React.useContext(LoadingDispatchContext);
  if (context === undefined) {
    throw new Error('need Provider');
  }
  return context;
}
function useWeb3State() {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error('need Provider');
  }
  return context;
}
function useWeb3Dispatch() {
  const context = React.useContext(Web3DispatchContext);
  if (context === undefined) {
    throw new Error('need Provider');
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
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload(true);
    });
    window.ethereum.on('networkChanged', () => {
      window.location.reload(true);
    });
  }
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

    const tweets = [];
    let nTweets = 0;
    nTweets = await contract.methods.nTweets().call();
    if (nTweets > 0) {
      const upperIndexRange = nTweets - 1 >= 0 ? nTweets - 1 : 0;
      const lowerIndexRange =
        upperIndexRange - (MAX_TWEETS_PER_PAGE - 1) >= 0
          ? upperIndexRange - (MAX_TWEETS_PER_PAGE - 1)
          : 0;
      for (let i = upperIndexRange; i >= lowerIndexRange; i -= 1) {
        const tweet = await contract.methods.tweets(i).call();
        const nComments = await contract.methods.tweetCommentLength(i).call();
        tweet.nComments = nComments;
        tweet.comments = [];
        if (nComments > 0) {
          for (let j = nComments - 1; j >= 0; j--) {
            const commentId = await contract.methods
              .getTweetCommentId(tweet.tweetId, j)
              .call();
            const comment = await contract.methods.comments(commentId).call();
            tweet.comments.push(comment);
          }
        }
        tweets.push(tweet);
      }
    }

    dispatch({
      type: 'loadContract',
      payload: { web3, contract, registered, handle, nTweets, tweets }
    });
  }
}

async function loadTweets(state: State, dispatch: Dispatch, offset = 0) {
  const { contract } = state;
  if (contract) {
    const tweets = [];
    let nTweets = 0;
    nTweets = await contract.methods.nTweets().call();
    if (nTweets > 0) {
      const upperIndexRange =
        nTweets - 1 - offset * MAX_TWEETS_PER_PAGE >= 0
          ? nTweets - 1 - offset * MAX_TWEETS_PER_PAGE
          : 0;
      const lowerIndexRange =
        upperIndexRange - (MAX_TWEETS_PER_PAGE - 1) >= 0
          ? upperIndexRange - (MAX_TWEETS_PER_PAGE - 1)
          : 0;
      for (let i = upperIndexRange; i >= lowerIndexRange; i -= 1) {
        const tweet = await contract.methods.tweets(i).call();
        const nComments = await contract.methods.tweetCommentLength(i).call();
        tweet.nComments = nComments;
        tweet.comments = [];
        if (nComments > 0) {
          for (let j = nComments - 1; j >= 0; j--) {
            const commentId = await contract.methods
              .getTweetCommentId(tweet.tweetId, j)
              .call();
            const comment = await contract.methods.comments(commentId).call();
            tweet.comments.push(comment);
          }
        }
        tweets.push(tweet);
      }
    }
    dispatch({
      type: 'loadTweets',
      payload: { nTweets, tweets }
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

async function newTweet(state: State, dispatch: Dispatch, msg: string) {
  const { contract } = state;
  if (contract && state.registered) {
    await contract.methods.tweet(msg).send();
    loadTweets(state, dispatch);
  }
}
async function reTweet(
  state: State,
  dispatch: Dispatch,
  msg: string,
  retweetId: number
) {
  const { contract } = state;
  if (contract && state.registered) {
    await contract.methods.retweet(msg, retweetId).send();
    loadTweets(state, dispatch);
  }
}

async function readTweet(state: State, id: number): Promise<Tweet> {
  const { contract } = state;
  if (contract) {
    const t = await contract.methods.tweets(id).call();
    return t;
  }
  throw new Error('tweet not found');
}
async function newComment(
  state: State,
  dispatch: Dispatch,
  tweetId: number,
  msg: string
) {
  const { contract } = state;
  if (contract && state.registered) {
    await contract.methods.comment(tweetId, msg).send();
    loadTweets(state, dispatch);
  }
}
export {
  Web3Provider,
  useWeb3State,
  useWeb3Dispatch,
  loadContract,
  loadUser,
  loadTweets,
  newTweet,
  reTweet,
  readTweet,
  newComment,
  LoadingProvider,
  useLoadingDispatch,
  useLoadingState,
  MAX_TWEETS_PER_PAGE
};
