import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ResponsiveDialog from "./deleteModal";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    async function dislike(event){
        event.stopPropagation()
        //copy pasted from deleteModal
        let theListItself=event.target.parentElement.parentElement.parentElement.parentElement
        let listName =theListItself.getElementsByClassName("MuiBox-root css-1mm12im")[0].innerHTML
        listName=listName.split("<br>By:")[0]
        let id=listName.id
        //we have the id, just need to get user info and update it now
        let response= await store.getAllUserTop5Lists()
        console.log(response)
    }

    let deleteButton=<div></div>
    if (true){
        deleteButton= 
        <Box sx={{ p: 1 ,float:"right", marginRight:"5%", marginBottom:"60%"}}>
        <ResponsiveDialog>  </ResponsiveDialog> 
        </Box>
    }

    let editPublishButton= 
        <Box sx={{ p: 1 }}>
        <IconButton            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }} aria-label='edit'>
            <EditIcon style={{fontSize:'16pt'}} />
        </IconButton>
        </Box>
    
    if (idNamePair.publishedDate != "unpublished"){
        editPublishButton= "published: " + idNamePair.publishedDate
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 ,backgroundColor: 'powderblue',borderRadius: 5, border:1}}
            button
            style={{
                fontSize: '16pt',
                width: '100%',
                height:'px'
            }}
        >   <div>
                <Box sx={{ p: 1, flexGrow: 0, mt: 1, fontSize:16 }}>
                    {idNamePair.name} 
                    <br />
                    By: {idNamePair.author}
                    <br/>
                    {editPublishButton}
                </Box>

        </div>
        <div style={{height:"40%", width:"100%", position:"absolute", top:"0px"}}>
            {deleteButton}

            <div style={{float:"right", marginRight:"5%", }}>
            {idNamePair.likes[1].length}
            </div>

            <button onClick={dislike}
            style={{float:"right", marginRight:"5%", }}>             
            <ThumbDownIcon style={{pointerEvents : "none"}}/>            
            </button>

            <div style={{float:"right", marginRight:"5%", }}>
            {idNamePair.likes[0].length}</div>
            
            <button onClick={dislike}
            style={{float:"right", marginRight:"5%", }}>             
            <ThumbUpIcon style={{pointerEvents : "none"}}/>            
            </button>
            <div style={{float:"right", marginRight:"-20%", marginTop:"100px", fontSize:16}}>
            Views: {idNamePair.views}
            </div>
            <KeyboardArrowDownIcon 
            style={{float:"right", marginRight:"-35%", marginTop:"100px"}}
            >            
            </KeyboardArrowDownIcon>
            </div>

        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;