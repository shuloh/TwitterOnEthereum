import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3State } from './Store';
// import { useWeb3State } from './Store';

const useStyles = makeStyles(() => ({
  container: {
    width: 400,
    overflowWrap: 'break-word'
  }
}));

const Tweets: React.FC = () => {
  const classes = useStyles();
  const state = useWeb3State();
  const tweets = state.tweets.map(t => (
    <Grid item key={t.tweetId} zeroMinWidth>
      <Paper className={classes.container}>
        <Typography color="textPrimary" variant="h6">
          {t.message}
        </Typography>
        <Button size="small">Comments</Button>
      </Paper>
    </Grid>
  ));
  return (
    <>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        {tweets}
      </Grid>
    </>
  );
};

export default Tweets;
