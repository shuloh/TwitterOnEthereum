import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3State, useWeb3Dispatch, loadUser } from './Store';

const useStyles = makeStyles(theme => ({
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: 300
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const UserRegistration: React.FC = () => {
  const classes = useStyles();
  const state = useWeb3State();
  const dispatch = useWeb3Dispatch();
  const [handle, setHandle] = useState('');
  const [registering, setRegistering] = useState(false);
  //   const state = useWeb3State();
  const register = async () => {
    setRegistering(true);
    if (state.contract) {
      setRegistering(true);
      try{
        await state.contract.methods.register(handle).send();
        loadUser(state, dispatch);
      }catch(e){
        console.error(e);
      }
      setRegistering(false);
    }
  };

  return (
    <>
      <Grid container direction="row">
        {state.registered === false && state.contract && (
          <>
            <Grid item>
              <TextField
                className={classes.textField}
                label="handle"
                variant="filled"
                value={handle}
                onChange={e => {
                  setHandle(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                size="medium"
                onClick={register}
              >
                register
              </Button>
            </Grid>
          </>
        )}
        {registering && (
          <Grid item>
            <CircularProgress className={classes.button} color="secondary" />
          </Grid>
        )}
        <Grid item>
          <Typography color="textPrimary">
            {state.registered && `Hello @${state.handle}`}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default UserRegistration;
