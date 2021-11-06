import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AuthContext from '../auth'



/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    let text ="";
    if (store.currentList && auth.loggedIn){
        if (store.currentList.name){
            text = store.currentList.name;
            //console.log(store.currentList.name)
        }
    }
    
    return (
        <div id="top5-statusbar">
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;