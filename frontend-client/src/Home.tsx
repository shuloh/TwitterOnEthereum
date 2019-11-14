import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import UserRegistration from './UserRegistration';
import Tweets from './Tweets';
import Web3Button from './Web3Button';
import NewTweet from './NewTweet';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    backgroundColor: theme.palette.background.default
  },
  typo: {
    color: theme.palette.text.primary
  }
}));
const Home: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.root} maxWidth={false}>
        <Grid
          container
          spacing={1}
          direction="column"
          justify="flex-start"
          alignItems="flex-end"
          className={classes.root}
        >
          <Grid item>
            <Web3Button />
          </Grid>
          <Grid item>
            <UserRegistration />
          </Grid>
          <Grid item>
            <NewTweet />
          </Grid>
          <Grid item zeroMinWidth>
            <Tweets />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
