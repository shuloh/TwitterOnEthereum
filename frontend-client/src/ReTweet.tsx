import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import {
  useWeb3State,
  useWeb3Dispatch,
  reTweet,
  useLoadingDispatch
} from './Store';

const useStyles = makeStyles(theme => ({
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: 300
  },
  button: {}
}));
export default function ReTweet(props: any) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [tweetMsg, setMsg] = React.useState('');
  const state = useWeb3State();
  const dispatch = useWeb3Dispatch();
  const loadingDispatch = useLoadingDispatch();
  const handleNewTweet = async () => {
    loadingDispatch(true);
    try {
      await reTweet(state, dispatch, tweetMsg, props.reTweetId);
    } catch (e) {
      console.error(e);
    }
    loadingDispatch(false);
    setMsg('');
    setOpen(false);
  };
  const handleMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        // variant="contained"
        color="default"
        onClick={handleClickOpen}
        disabled={!state.registered}
        className={classes.button}
      >
        ReTweet!
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">ReTweet</DialogTitle>
        <DialogContent>
          <DialogContentText>retweet: '{props.reTweetMsg}'</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="..."
            type="text"
            fullWidth
            value={tweetMsg}
            onChange={handleMsgChange}
            multiline
            rows="5"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleNewTweet} color="primary" variant="contained">
            ReTweet!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
