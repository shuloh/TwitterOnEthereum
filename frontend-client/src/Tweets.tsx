import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
  useWeb3State,
  useWeb3Dispatch,
  useLoadingState,
  useLoadingDispatch,
  loadTweets,
  MAX_TWEETS_PER_PAGE
} from './Store';
import ReTweet from './ReTweet';
import NewComment from './NewComment';
import ReadTweet from './ReadTweet';
// import { useWeb3State } from './Store';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.default
  },
  container: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    minWidth: 320,
    maxWidth: 320,
    overflowWrap: 'break-word'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 50
  }
}));

const Tweets: React.FC = () => {
  const classes = useStyles();
  const state = useWeb3State();
  const dispatch = useWeb3Dispatch();
  const loadingState = useLoadingState();
  const loadingDispatch = useLoadingDispatch();
  const [offset, setOffset] = useState(1);
  const handleOffset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(e.target.value);
    const offset = page - 1;
    if (state.nTweets > offset * MAX_TWEETS_PER_PAGE) {
      setOffset(page);
      try {
        loadingDispatch(true);
        await loadTweets(state, dispatch, offset);
        loadingDispatch(false);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const tweets = state.tweets.map(t => (
    <Grid item xs key={t.tweetId} zeroMinWidth>
      <Paper className={classes.container} key={t.tweetId}>
        <Typography color="textPrimary" variant="h5">
          #{t.tweetId}
        </Typography>
        <Typography color="textPrimary" variant="h6">
          {t.message}
        </Typography>
        <Typography color="secondary" variant="body1">
          @{t.authorName}
        </Typography>
        {t.retweeted && <ReadTweet tweetId={t.retweetId} />}
        <NewComment
          key={t.tweetId}
          tweetId={t.tweetId}
          nComments={t.nComments}
          comments={t.comments}
        />
        <ReTweet reTweetId={t.tweetId} reTweetMsg={t.message} />
      </Paper>
    </Grid>
  ));
  return (
    <>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item>
            {state.registered && (
              <TextField
                color="secondary"
                id="standard-number"
                label="Page: "
                type="number"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{ step: '1', min: '1' }}
                margin="normal"
                onChange={handleOffset}
                value={offset}
                disabled={loadingState}
              />
            )}
          </Grid>
          {tweets}
        </Grid>
      </div>
    </>
  );
};

export default Tweets;
