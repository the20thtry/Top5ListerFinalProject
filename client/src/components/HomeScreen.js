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


    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store && (store.idNamePairs.length==auth.user.items.length)) {
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
    return (
        <div id="top5-list-selector"style={{backgroundColor:'gray'}} >
            <div id="list-selector-heading">
            <Fab 
                onClick={handleCreateNewList}
            >
                <HomeIcon />
            </Fab>
            <Fab 
                onClick={handleCreateNewList}
            >
                <GroupsIcon />
            </Fab>
            <Fab 
                onClick={handleCreateNewList}
            >
                <PersonIcon />
            </Fab>
            <Fab 
                onClick={handleCreateNewList}
            >
                <FunctionsIcon />
            </Fab>
            <FullWidthTextField></FullWidthTextField>

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