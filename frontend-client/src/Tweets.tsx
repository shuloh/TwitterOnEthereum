import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 0,
    height: "100vh",
    backgroundColor: theme.palette.background.default
  },
  typo: {
    color: theme.palette.text.secondary
  }
}));
const Tweets: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" className={classes.root}>
      {console.log(classes)}
      <Typography className={classes.typo}>Hi</Typography>
    </Grid>
  );
};

export default Tweets;
