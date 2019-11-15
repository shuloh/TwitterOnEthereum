import React from 'react';
import { useLoadingState } from './Store';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    },
    height: 10
  }
}));

export default function Progress() {
  const classes = useStyles();
  const state = useLoadingState();
  return (
    <>
      {state && <LinearProgress color="secondary" className={classes.root} />}
    </>
  );
}
