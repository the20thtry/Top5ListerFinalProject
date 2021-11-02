import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useContext, useState } from 'react'

import { GlobalStoreContext } from '../store'


export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { store } = useContext(GlobalStoreContext);


    const handleClickOpen = (event) => {
    let listName = event.target.parentElement.parentElement.parentElement.getElementsByClassName("MuiBox-root css-3rviqk")[0].innerHTML
    event.stopPropagation();
    store.markListForDeletion(event.target.parentElement.parentElement.parentElement.id)
    setOpen(listName);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    store.unmarkListForDeletion()
    setOpen(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation()
    setOpen(false)
    store.deleteMarkedList()
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        delete list
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete top 5 list?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete this top 5 {open} list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
