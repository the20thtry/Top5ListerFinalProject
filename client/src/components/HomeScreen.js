import React, { useContext, useEffect,useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import AuthContext from '../auth'
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountMenu from './SortMenu';



/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/


function FullWidthTextField() {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '40%',
        marginRight:5
      }}
    >
      <TextField fullWidth label="search" id="fullWidth" />
    </Box>
  );
}

const HomeScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    useEffect(async () => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    let x=document.getElementById("HomeIcon")

    let author=""
    if(auth.user){
        author=auth.user.firstName+" "+auth.user.lastName
    }
    if ((store.idNamePairs[0]) && ((store.idNamePairs[0].author==author)
     ||(x && x.selected==false))){// { //YOOO BRUH WTF,ahhh i see used to fix bad bug from before sadge
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'gray' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    function selectButton(event){
        let allIcons=document.getElementsByClassName(event.target.className)
        let iconSelected=event.target.id
        for(let i=0;i<allIcons.length;i++){
            if(allIcons[i].id==iconSelected){
                return document.getElementById(iconSelected).selected=true
            }
            else{
                document.getElementById(allIcons[i].id).selected=false
            }
        }
    }

    let searchValue=""
    function handleTextChange(event){
        searchValue=event.target.value
    }

    function handleSearch(event){
        if(event.key=="Enter"){
            let icons= store.getSelectedIcon()
            store.loadIdNamePairs(icons,"0",store.getSearchValue())
        }
    }

    return (
        <div id="top5-list-selector"style={{backgroundColor:'gray'}} >
            <div id="list-selector-heading">
            <Fab 
                onClick={selectButton}
                id="HomeIcon"
                selected={true}
            >
                <HomeIcon  style={{pointerEvents:"none"}}/>
            </Fab>
            <Fab 
                onClick={selectButton}
                id="GroupsIcon"
                selected={false}
            >
                <GroupsIcon  style={{pointerEvents:"none"}}/>
            </Fab>
            <Fab 
                onClick={selectButton}
                id="PersonIcon" 
                selected={false}
            >
                <PersonIcon style={{pointerEvents:"none"}}/>
            </Fab>
            <Fab 
                onClick={selectButton}
                id="FunctionsIcon"
                selected={false}
            >
                <FunctionsIcon style={{pointerEvents:"none"}}/>
            </Fab>

            <Box
            onKeyPress={handleSearch}
            onChange={handleTextChange}
            sx={{
                width: 500,
                maxWidth: '40%',
                marginRight:5
            }}
            >
            <TextField fullWidth label="search" id="searchBar" />
            </Box>
            Sort by

                <AccountMenu></AccountMenu>

            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
 
            </div>
        </div>)
        
}

export default HomeScreen;