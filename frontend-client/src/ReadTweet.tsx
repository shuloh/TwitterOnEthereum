import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useWeb3State, readTweet, useLoadingDispatch } from './Store';

export default function ReadTweet(props: any) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const state = useWeb3State();
  const loadingDispatch = useLoadingDispatch();

  const handleClickOpen = async () => {
    loadingDispatch(true);
    try {
      const tweet = await readTweet(state, props.tweetId);
      if (tweet !== null) {
        setMessage(tweet.message);
        setOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
    loadingDispatch(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} disabled={!state.registered}>
        retweeted: #{props.tweetId}
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">#{props.tweetId}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
