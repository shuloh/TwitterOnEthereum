import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
  loadContract,
  useWeb3Dispatch,
  useWeb3State,
  useLoadingDispatch
} from './Store';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  typo: {
    color: theme.palette.text.primary
  }
}));

const Web3Button: React.FC = () => {
  const classes = useStyles();
  const dispatch = useWeb3Dispatch();
  const loading = useLoadingDispatch();
  const state = useWeb3State();
  async function buttonLoadContract(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    loading(true);
    try {
      await loadContract(dispatch);
    } catch (e) {
      console.error(e);
    }
    loading(false);
  }
  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      disabled={state.web3 !== null}
      onClick={buttonLoadContract}
    >
      Load Web3
    </Button>
  );
};

export default Web3Button;
