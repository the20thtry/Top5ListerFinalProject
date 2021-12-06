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
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { GlobalStoreContext } from '../store'


export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { store } = useContext(GlobalStoreContext);


    const handleClickOpen = (event) => {
    event.stopPropagation();
    let theListItself=event.target.parentElement.parentElement.parentElement.parentElement
    let listName =theListItself.getElementsByClassName("MuiBox-root css-1mm12im")[0].innerHTML
    listName=listName.split("</h3><br>")[0]
    listName=listName.split("h3 class=\"MuiTypography-root MuiTypography-h3 css-gepadz-MuiTypography-root\">")[1]
    console.log(store.idNamePairs)
    store.markListForDeletion(theListItself.id)
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
      <Button variant="outlined" onClick={handleClickOpen} style={{fontSize:12}}>
        <DeleteSharpIcon style={{pointerEvents : "none"}}/>
      </Button>
      <Dialog
        fullScreen={false}
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
