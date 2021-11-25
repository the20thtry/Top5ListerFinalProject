import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [draggedTo, setDraggedTo] = useState(0);

    function handleDragStart(event, targetId) {
        targetId= event.target.id.substring(event.target.id.indexOf("-") + 1);
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        targetId=event.target.id.substring(event.target.id.indexOf("-") + 1);
        setDraggedTo(false);

        console.log("handleDrop (sourceId, targetId): ( " + sourceId + ", " + targetId + ")");

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let index = event.target.id.substring("list-".length);
            let text = event.target.value;
            store.addUpdateItemTransaction(index-1, text);
            toggleEdit();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }


    let editStatus = false;
    if (store.isItemEditActive) {
        editStatus = true;
    }
    let { index } = props;
    if (editActive) {
        return (
            <TextField
            margin="normal"
            required
            fullWidth
            label="Top 5 item Name"
            name="name"
            autoComplete="Top 5 Item Name"
            inputProps={{style: {fontSize: 48}}}
            InputLabelProps={{style: {fontSize: 24}}}
            autoFocus
                id={"item-" + (index+1)}
                className='top5-item'
                type='text'
                onKeyPress={handleKeyPress}
                defaultValue={props.text}
            />)
    }
    else {
        let itemClass = "top5-item";
        if (draggedTo) {
            itemClass = "top5-item-dragged-to";
        }
        return (
            <div
                id={'item-' + (index+1)}
                className={itemClass}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable="true"
            >
            <Box sx={{ p: 1 }}>
            <EditIcon 
                style={{fontSize:'36pt'}}
                aria-label='edit'
                disabled={editStatus}
                type="button"
                id={"edit-item-" + index+1}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
            </Box>
            {props.text}
            </div>)
    }
}

export default Top5Item;