import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { loadContract, useWeb3Dispatch, useWeb3State } from './Store';

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
  const state = useWeb3State();
  function buttonLoadContract(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    loadContract(dispatch);
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