import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    let listName="untitled"
    if (store.currentList){
        listName=store.currentList.name
    }

    async function saveList(ev){
        ev.stopPropagation()
        let currentList=store.currentList
        try{
            await store.changeListName(currentList._id, listName)
            await store.saveTempListToUser()
            store.closeCurrentList()
        }
        catch{
            store.closeCurrentList()
        }

    }
    var month = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    async function publish(ev){
        ev.stopPropagation()
        let currentList=store.currentList
        try{
            let date=(new Date())
            let formattedDate=month[(date.getUTCMonth())] + " " + date.getDate() + ", " +date.getFullYear()
            await store.changeListName(currentList._id, listName,formattedDate)
            await store.saveTempListToUser()
            await store.publishList(currentList._id)
            await store.createTop5CommunityListById(currentList._id)
            store.closeCurrentList()
        }
        catch{
            store.closeCurrentList()
        }
    }

    function updateListName(ev){
        listName= (ev.target.value)
    }

    function FullWidthTextField() {
        return (
          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
              marginRight:5,
              backgroundColor:"white"
            }}
          >
            <TextField fullWidth label={listName} id="fullWidth" defaultValue={listName} onChange={updateListName} />
          </Box>
        );
      }
    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }

    //finds if current list is valid to publish
    function currentListValid(currentList){
        let listName=currentList.name
        for(let i=0;i<store.idNamePairs.length;i++){
            if(store.idNamePairs[i].publishedDate!="unpublished" && store.idNamePairs[i].name==listName){ //cant publish two list of same name
                return false
            }
        }
        let items=currentList.items
        for(let i =0;i<5;i++){
            for(let j=i+1;j<5;j++){
                if(items[i]==items[j] || items[i].trim()=="" || items[j].trim()==""){
                    return false
                }
            }
        }
        return true
    }

    let publishButton= <div class='publish-button' disabled style={{color:"white"}}>Publish </div>
    console.log(store.currentList)
    if(store.currentList){
        if(store.currentList.publishedDate=="unpublished" &&  currentListValid(store.currentList)){
            publishButton= <Button class='publish-button' onClick={publish}>Publish </Button>
        }
    }
    


    return (
        <div id="top5-workspace">
            <FullWidthTextField></FullWidthTextField>
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
            <div className="save-publish-div">
                <Button class='save-button' onClick={saveList}>save</Button>
                {publishButton}
            </div>
        </div>
    )
}

export default WorkspaceScreen;