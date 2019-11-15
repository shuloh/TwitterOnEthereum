import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  useWeb3State,
  useWeb3Dispatch,
  newComment,
  useLoadingDispatch
} from './Store';

export default function NewComment(props: any) {
  const [open, setOpen] = React.useState(false);
  const [commentMsg, setMsg] = React.useState('');
  const state = useWeb3State();
  const dispatch = useWeb3Dispatch();
  const loadingDispatch = useLoadingDispatch();

  const handleNewComment = async () => {
    loadingDispatch(true);
    try {
      await newComment(state, dispatch, props.tweetId, commentMsg);
    } catch (e) {
      console.error(e);
    }
    loadingDispatch(false);
    setMsg('');
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
    <>
      <Button
        size="small"
        onClick={handleClickOpen}
      >{`${props.nComments} Comments`}</Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          #{props.tweetId} Comments
        </DialogTitle>
        <DialogContent>
          {props.comments.map((t: any, i: any) => {
            return (
              <Paper key={t.commentId}>
                <Typography variant="body2" color="textPrimary">
                  {t.comment}
                </Typography>
                <Typography variant="caption" color="secondary">
                  @{t.authorName}
                </Typography>
              </Paper>
            );
          })}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="..."
            type="text"
            fullWidth
            value={commentMsg}
            onChange={handleMsgChange}
            multiline
            rows="5"
            disabled={!state.registered}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            disabled={!state.registered}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNewComment}
            color="primary"
            variant="contained"
            disabled={!state.registered}
          >
            Comment!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
