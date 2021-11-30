import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';



/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    let text ="";
    function handleCreateNewList() {
        if(auth.user && auth.user.email!="Guest-reserved-email")
        store.createNewList();
    }
    if (auth.loggedIn){
        if (store.currentList && store.currentList.name){
            text = store.currentList.name;
            //console.log(store.currentList.name)
        }
        else{
            text = <div >
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h4">Your Lists</Typography>
            </div>
        }
    }
    else{
        //some guest stuffs??
    }
    
    return (
        <div id="top5-statusbar">
            <Typography variant="h3">{text}</Typography>
        </div>
    );
}

export default Statusbar;