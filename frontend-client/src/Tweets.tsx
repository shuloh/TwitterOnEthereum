import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import { useWeb3State } from './Store';

const Tweets: React.FC = () => {
  //   const state = useWeb3State();
  return (
    <>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item>
          <Typography color="textPrimary">Tweet 2</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Tweets;
