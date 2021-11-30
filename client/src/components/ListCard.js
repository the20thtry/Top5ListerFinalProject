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
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [viewActive, setViewActive] = useState(false);
    const [text, setText] = useState("");
     let { idNamePair } = props;

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
        if(auth.user.email=="Guest-reserved-email")
            return
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

            updatedInfo["0"]=response[0].user.items
            let temp=response[0].user.author
            updatedInfo["2"]=temp
            temp= response[0].user.publishedDate
            updatedInfo["3"]=temp
            temp= response[0].user.views
            updatedInfo["4"]=temp
            temp= response[0].user.comments
            updatedInfo["5"]=temp
             
            temp= response[0].user.likes

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

            //stuffs for community lists
            if(store.idNamePairs && store.idNamePairs[0] && store.idNamePairs[0].votes){ //check if lists have votes, if yes, then its a community list
                let communityList= (await api.getCommunityTop5ListById(id)).data.top5List
                let dislike=true
                for(let i=0;i<communityList.likes[1].length;i++){//check if user already disliked
                    if(communityList.likes[1][i]==auth.user._id){
                        dislike=false
                    }
                }
                if(dislike){
                    communityList.likes[1].push(auth.user._id)
                    const index =  communityList.likes[0].indexOf(auth.user._id);
                    if (index > -1) {
                    communityList.likes[0].splice(index, 1);
                    }
                }
                
                await api.updateCommunityTop5ListById(id,communityList)
            }else{ //old stuffs
                if(response[0].user.publishedDate[response[1].listNumber]!="unpublished"){//needs to update the published list as well
                    let top5List=[]
                    top5List["3"]=temp[response[1].listNumber]
                    top5List["0"]=response[0].user.items[response[1].listNumber][1] //name
                    top5List["1"]=response[0].user.items[response[1].listNumber].slice(2,7) //items
                    temp=response[0].user.author
                    top5List["2"]=temp[response[1].listNumber]
                    temp= response[0].user.publishedDate
                    top5List["5"]=temp[response[1].listNumber]
                    temp= response[0].user.views
                    top5List["6"]=temp[response[1].listNumber]
                    temp= response[0].user.comments
                    top5List["4"]=temp[response[1].listNumber]
                    await api.updatePublishedTop5ListById(response[0].user.items[response[1].listNumber][0],top5List)
                }
    
    
    
                let newUserData= await api.updateUser(email, updatedInfo)
                auth.user=(await api.getUserById(auth.user._id)).data.user

            }


            store.loadIdNamePairs(selectedIcon)
        }
        else{
            console.log("dislike failed")
        }
    }

    //LITERALLY COPY PASTED FROM DISLIKE FUNCTION, THEN SWAPPED THEM,
    //reminder :listNumber[1] -> listNumber[0]
    async function like(event){
        if(auth.user.email=="Guest-reserved-email")
            return
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
            
            updatedInfo["0"]=response[0].user.items
            let temp=response[0].user.author
            updatedInfo["2"]=temp
            temp= response[0].user.publishedDate
            updatedInfo["3"]=temp
            temp= response[0].user.views
            updatedInfo["4"]=temp
            temp= response[0].user.comments
            updatedInfo["5"]=temp

            temp= response[0].user.likes

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
            //stuffs for community lists copied from dislike
            if(store.idNamePairs && store.idNamePairs[0] && store.idNamePairs[0].votes){ //check if lists have votes, if yes, then its a community list
                let communityList= (await api.getCommunityTop5ListById(id)).data.top5List
                let like=true
                for(let i=0;i<communityList.likes[0].length;i++){//check if user already liked
                    if(communityList.likes[0][i]==auth.user._id){
                        like=false
                    }
                }
                if(like){ //has to undislike when liked
                    communityList.likes[0].push(auth.user._id)
                    const index =  communityList.likes[1].indexOf(auth.user._id);
                    if (index > -1) {
                    communityList.likes[1].splice(index, 1);
                    }
                }
                await api.updateCommunityTop5ListById(id,communityList)
            }
            else{
                if(response[0].user.publishedDate[response[1].listNumber]!="unpublished"){//needs to update the published list as well
                    let top5List=[]
                    top5List["3"]=temp[response[1].listNumber]
    
                    top5List["0"]=response[0].user.items[response[1].listNumber][1] //name
                    top5List["1"]=(response[0].user.items[response[1].listNumber]).slice(2) //items
                    temp=response[0].user.author
                    top5List["2"]=temp[response[1].listNumber]
                    temp= response[0].user.publishedDate
                    top5List["5"]=temp[response[1].listNumber]
                    temp= response[0].user.views
                    top5List["6"]=temp[response[1].listNumber]
                    temp= response[0].user.comments
                    top5List["4"]=temp[response[1].listNumber]
                    await api.updatePublishedTop5ListById(response[0].user.items[response[1].listNumber][0],top5List)
                }
    
    
    
                let newUserData= await api.updateUser(email, updatedInfo)
                auth.user=(await api.getUserById(auth.user._id)).data.user

            }

            store.loadIdNamePairs(selectedIcon)
        }
        else{
            console.log("like failed")
        }
    }

    let comment=""
    let commentId=""
    let selectedIcon="HomeIcon"

    if(document.getElementById("GroupsIcon")&& document.getElementById("GroupsIcon").selected){
        selectedIcon="GroupsIcon"
    }
    if(document.getElementById("PersonIcon")&& document.getElementById("PersonIcon").selected){
        selectedIcon="PersonIcon"
    }
    if(document.getElementById("FunctionIcon") && document.getElementById("FunctionIcon").selected){
        selectedIcon="FunctionIcon"
    }

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
        //idk wtf i wrote earlier but new code time! copy pasted from views to like/dislikes/comment

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

            if(store.idNamePairs && store.idNamePairs[0] && store.idNamePairs[0].votes){ //check if lists have votes, if yes, then its a community list
                let communityList= (await api.getCommunityTop5ListById(id)).data.top5List
                communityList.views+=1
                await api.updateCommunityTop5ListById(id,communityList)
            }
            else{

                if(response[0].user.publishedDate[response[1].listNumber]!="unpublished"){//needs to update the published list as well
                    let top5List=[]
    
                    temp= response[0].user.views
                    top5List["6"]=temp[response[1].listNumber]
                    top5List["0"]=response[0].user.items[response[1].listNumber][1] //name
                    top5List["1"]=(response[0].user.items[response[1].listNumber]).slice(2) //items
                    temp=response[0].user.author
                    top5List["2"]=temp[response[1].listNumber]
                    temp= response[0].user.publishedDate
                    top5List["5"]=temp[response[1].listNumber]
                    temp= response[0].user.likes
                    top5List["3"]=temp[response[1].listNumber]
                    temp= response[0].user.comments
                    top5List["4"]=temp[response[1].listNumber]
                    await api.updatePublishedTop5ListById(response[0].user.items[response[1].listNumber][0],top5List)
                }
    
    
                let newUserData= await api.updateUser(email, updatedInfo)
                auth.user=(await api.getUserById(auth.user._id)).data.user
                
                //auth.user=newUserData.data.user //really bad lmao

            }



            toggleEdit() //needed to show list
            

            //might cause issues/bugs
            //store.loadIdNamePairs(selectedIcon)
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
        if(auth.user.email=="Guest-reserved-email")
            return
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
                if(store.idNamePairs && store.idNamePairs[0] && store.idNamePairs[0].votes){ //check if lists have votes, if yes, then its a community list
                    let communityList= (await api.getCommunityTop5ListById(commentId)).data.top5List
                    communityList.comments.push(comment)
                    await api.updateCommunityTop5ListById(commentId,communityList)
                }else{
                    let newUserData= await api.updateUser(email, updatedInfo)
                    auth.user=(await api.getUserById(auth.user._id)).data.user
                }

                store.loadIdNamePairs(selectedIcon)

            }else{
                console.log("handleComment failed")
            }
        }
    }

    let deleteButton=<div></div>
    console.log()
    if (document.getElementById("HomeIcon") && document.getElementById("HomeIcon").selected==true){//need fix here ->>happens only when in home screen
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
    
    let color1='yellow'
    if (idNamePair.publishedDate != "unpublished"){ //changes needed for published lists
        color1="powderblue"
        editPublishButton= 
        <Box sx={{ p: 1 }}>
        <div style={{fontSize:'12pt'}}><Typography variant="h6" color="red" style={{fontSize:'12pt'}}>published:  {idNamePair.publishedDate}</Typography>
        </div>
        </Box>
        //HEREH
    }

    let viewingBlock=<div>  </div>
    let showListButton=<KeyboardArrowDownIcon onClick={handleView} style={{float:"left", marginLeft:"600px"}}></KeyboardArrowDownIcon>
    if (editActive) {
        showListButton=<ArrowUpwardIcon onClick={toggleEdit} style={{float:"left", marginLeft:"600px"}}></ArrowUpwardIcon>
        viewingBlock=
        <div style={{backgroundColor:{color1}, width:"750px",height:"300px"}}> 
            <div style={{width:"45%", position:"absolute", height:"300px",fontSize:"48", contain:"strict",backgroundColor:"blue", borderRadius:"35px",overflowY:"scroll"}}>
                <Typography variant="h3" color="yellow">1.{idNamePair.items[0]}</Typography>
                <Typography variant="h3" color="yellow">2.{idNamePair.items[1]}</Typography>
                <Typography variant="h3" color="yellow">3.{idNamePair.items[2]}</Typography>
                <Typography variant="h3" color="yellow">4.{idNamePair.items[3]}</Typography>
                <Typography variant="h3" color="yellow">5.{idNamePair.items[4]}</Typography>
            </div>


            <div style={{left:"50%",width:"45%", position:"absolute", height:"240px",fontSize:"48", contain:"strict",backgroundColor:{color1}, borderRadius:"15px",overflowY:"scroll"}}>
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
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 ,backgroundColor: color1,borderRadius: 5, border:1}}
            
            style={{
                fontSize: '16pt',
                width: '800px',
                height:'px',
                position:"relative",
            }}
        >   <div >
                <Box sx={{ p: 1, flexGrow: 0, mt: 1, fontSize:16 }}>
                    {idNamePair.name} 
                    <br />
                    By: {idNamePair.author}
                    <br/>
                    {viewingBlock}

                    <div style={{float:"left", marginLeft:"0px",height:100, width:"750px",fontSize:16}}>
                        {editPublishButton}
                        Views: {idNamePair.views}
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