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
import api from '../api'
import AuthContext from '../auth'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Typography } from '@mui/material';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [viewActive, setViewActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;
    const { auth } = useContext(AuthContext);

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

    function toggleView() {
        let newActive = !viewActive;
        if (newActive) {
            store.setViewActive();
            console.log("activate the view")
        }
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
        let id=event.target.parentElement.parentElement.id
        //we have the id, just need to get user info and update it now
        let response = await store.getUserTop5ListById(id)
        if (response){
            let likesArray=(response[0].user.likes[response[1].listNumber])[0]
            let dislikesArray=(response[0].user.likes[response[1].listNumber])[1]
            //just keeping the basic stuffs
            let email= response[0].user.email
            let updatedInfo =[]

            let temp= response[0].user.likes

            for(let i=0;i<likesArray.length;i++){
                const index = likesArray.indexOf(auth.user._id);
                if (index > -1) {
                likesArray.splice(index, 1);
                }
            }
            for(let i=0;i<dislikesArray.length;i++){
                const index = dislikesArray.indexOf(auth.user._id);
                if (index <= -1) {
                    (temp[response[1].listNumber])[1].push(auth.user._id)
                }
            }

            if(dislikesArray.length==0){
                (temp[response[1].listNumber])[1].push(auth.user._id)
            }

            updatedInfo["1"]=temp
            updatedInfo["0"]=response[0].user.items
            temp=response[0].user.author
            updatedInfo["2"]=temp
            temp= response[0].user.publishedDate
            updatedInfo["3"]=temp
            temp= response[0].user.views
            updatedInfo["4"]=temp
            temp= response[0].user.comments
            updatedInfo["5"]=temp

            let newUserData= await api.updateUser(email, updatedInfo)
            auth.user=newUserData.data.user    
            store.loadIdNamePairs()
        }
        else{
            console.log("dislike failed")
        }
    }

    //LITERALLY COPY PASTED FROM DISLIKE FUNCTION, THEN SWAPPED THEM,
    //reminder :listNumber[1] -> listNumber[0]
    async function like(event){
        event.stopPropagation()
        //copy pasted from deleteModal
        let theListItself=event.target.parentElement.parentElement.parentElement.parentElement
        let listName =theListItself.getElementsByClassName("MuiBox-root css-1mm12im")[0].innerHTML
        listName=listName.split("<br>By:")[0]
        let id=event.target.parentElement.parentElement.id
        //we have the id, just need to get user info and update it now
        let response = await store.getUserTop5ListById(id)
        if (response){
            let likesArray=(response[0].user.likes[response[1].listNumber])[0]
            let dislikesArray=(response[0].user.likes[response[1].listNumber])[1]
            //just keeping the basic stuffs
            let email= response[0].user.email
            let updatedInfo =[]

            let temp= response[0].user.likes

            for(let i=0;i<dislikesArray.length;i++){
                const index = dislikesArray.indexOf(auth.user._id);
                if (index > -1) {
                dislikesArray.splice(index, 1);
                }
            }
            for(let i=0;i<likesArray.length;i++){
                const index = likesArray.indexOf(auth.user._id);
                if (index <= -1) {
                    (temp[response[1].listNumber])[0].push(auth.user._id)
                }
            }

            if(likesArray.length==0){
                (temp[response[1].listNumber])[0].push(auth.user._id)
            }

            updatedInfo["1"]=temp
            updatedInfo["0"]=response[0].user.items
            temp=response[0].user.author
            updatedInfo["2"]=temp
            temp= response[0].user.publishedDate
            updatedInfo["3"]=temp
            temp= response[0].user.views
            updatedInfo["4"]=temp
            temp= response[0].user.comments
            updatedInfo["5"]=temp

            let newUserData= await api.updateUser(email, updatedInfo)
            auth.user=newUserData.data.user    
            store.loadIdNamePairs()
        }
        else{
            console.log("like failed")
        }
    }

    let comment=""
    let commentId=""
    //mostly copy pasted from the dislike as well...
    async function handleView(event){
        event.stopPropagation()
        //copy pasted from deleteModal
        let theListItself=event.target.parentElement.parentElement.parentElement.parentElement
        let listName =theListItself.getElementsByClassName("MuiBox-root css-1mm12im")[0].innerHTML
        listName=listName.split("<br>By:")[0]

        let id=event.target.parentElement.parentElement.parentElement.parentElement.id
        //we have the id, just need to get user info and update it now
        let response = await store.getUserTop5ListById(id)
        if (response){
            let email= response[0].user.email
            let updatedInfo =[]

            let temp= response[0].user.likes
            updatedInfo["1"]=temp
            updatedInfo["0"]=response[0].user.items
            temp=response[0].user.author
            updatedInfo["2"]=temp
            temp= response[0].user.publishedDate
            updatedInfo["3"]=temp
            temp= response[0].user.views

            temp[response[1].listNumber]+=1

            updatedInfo["4"]=temp
            temp= response[0].user.comments
            updatedInfo["5"]=temp

            toggleEdit() //needed to show list???

            let newUserData= await api.updateUser(email, updatedInfo)
            auth.user=newUserData.data.user    //might cause issues/bugs
            //store.loadIdNamePairs()
            //store.setViewActive()



        }
        else{
            console.log("view failed")
        }
    }



    async function handleTypingComment(event){
        comment=event.target.value
        commentId= event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id
    }

    async function handleComment(event){
        if(event.key=="Enter"){
            console.log(commentId)
            let response= await store.getUserTop5ListById(commentId)
            if(response){
                let email= response[0].user.email
                let updatedInfo =[]

                let temp= response[0].user.likes
                updatedInfo["1"]=temp
                updatedInfo["0"]=response[0].user.items
                temp=response[0].user.author
                updatedInfo["2"]=temp
                temp= response[0].user.publishedDate
                updatedInfo["3"]=temp
                temp= response[0].user.views    
                updatedInfo["4"]=temp
                temp= response[0].user.comments

                temp[response[1].listNumber].push(comment)

                updatedInfo["5"]=temp
    
                let newUserData= await api.updateUser(email, updatedInfo)
                auth.user=newUserData.data.user  

                store.loadIdNamePairs()

            }else{
                console.log("handleComment failed")
            }
        }
    }

    let deleteButton=<div></div>
    if (idNamePair.publishedDate == "unpublished" ){//need fix here ->> or user is the list owner
        console.log(auth.user.email)
        deleteButton= 
        <Box sx={{ p: 1 ,float:"right", marginRight:"5%", marginBottom:"60%"}}>
        <ResponsiveDialog>  </ResponsiveDialog> 
        </Box>
    }

    let editPublishButton= 
        <Box sx={{ p: 1 }}>
        <IconButton   onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }} aria-label='edit'>
            <button style={{fontSize:'16pt'}}><Typography variant="h6" color="red">Edit</Typography></button>
        </IconButton>
        </Box>
    
    if (idNamePair.publishedDate != "unpublished"){
        editPublishButton= 
        <Box sx={{ p: 1 }}>
        <div style={{fontSize:'16pt'}}><Typography variant="h6" color="red">published:  {idNamePair.publishedDate}</Typography>
        </div>
        </Box>
        //HEREH
    }

    let viewingBlock=<div>  </div>
    let showListButton=<KeyboardArrowDownIcon onClick={handleView} style={{float:"left", marginLeft:"600px"}}></KeyboardArrowDownIcon>
    let views_plus_one= 0
    if (editActive) {
        showListButton=<ArrowUpwardIcon onClick={store.loadIdNamePairs} style={{float:"left", marginLeft:"600px"}}></ArrowUpwardIcon>
        viewingBlock=
        <div style={{backgroundColor:"powderblue", width:"750px",height:"300px"}}> 
            <div style={{width:"45%", position:"absolute", height:"300px",fontSize:"48", contain:"strict",backgroundColor:"blue", borderRadius:"35px"}}>
                <Typography variant="h3" color="yellow">1.{idNamePair.items[0]}</Typography>
                <Typography variant="h3" color="yellow">2.{idNamePair.items[1]}</Typography>
                <Typography variant="h3" color="yellow">3.{idNamePair.items[2]}</Typography>
                <Typography variant="h3" color="yellow">4.{idNamePair.items[3]}</Typography>
                <Typography variant="h3" color="yellow">5.{idNamePair.items[4]}</Typography>
            </div>


            <div style={{left:"50%",width:"45%", position:"absolute", height:"240px",fontSize:"48", contain:"strict",backgroundColor:"powderblue", borderRadius:"15px",overflowY:"scroll"}}>
            {
                idNamePair.comments.map((val) => (
                    <div style={{width:"100%", position:"relative", height:"100px",fontSize:"12", contain:"strict",backgroundColor:"orange", borderRadius:"15px",marginBottom:10,whiteSpace:"normal"}}>
                    <div><Typography variant="h6" color="blue" style={{marginLeft:10, fontSize:8}}> {idNamePair.author} </Typography></div>
                    <Typography variant="h6" color="black" style={{marginLeft:10, fontSize:12,}}> {val} </Typography>
                    </div>
                ))
            }
            </div>
            <Box
              sx={{
                top:"65%",left:"50%",width:"45%", position:"absolute", height:"40px",fontSize:"48", contain:"strict"
               }}>
             <TextField fullWidth label="Add Comment" id="fullWidth" onChange={handleTypingComment} onKeyPress={handleComment}/>
            </Box>

        </div>
        views_plus_one =1
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 ,backgroundColor: 'powderblue',borderRadius: 5, border:1}}
            
            style={{
                fontSize: '16pt',
                width: '800px',
                height:'px',
                position:"relative"
            }}
        >   <div>
                <Box sx={{ p: 1, flexGrow: 0, mt: 1, fontSize:16 }}>
                    {idNamePair.name} 
                    <br />
                    By: {idNamePair.author}
                    <br/>
                    {viewingBlock}

                    <div style={{float:"left", marginLeft:"0px",height:100, width:"750px",fontSize:16}}>
                        {editPublishButton}
                        Views: {idNamePair.views+views_plus_one}
                        {showListButton}
                        </div>
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
            
            <button onClick={like}
            style={{float:"right", marginRight:"5%", }}>             
            <ThumbUpIcon style={{pointerEvents : "none"}}/>            
            </button>

            </div>

        </ListItem>


    return (
        cardElement
    );
}

export default ListCard;