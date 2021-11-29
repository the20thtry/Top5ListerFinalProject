import { useContext, useState } from 'react'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SortIcon from '@mui/icons-material/Sort';
import { GlobalStoreContext } from '../store'
import { Fragment } from 'react';



export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { store } = useContext(GlobalStoreContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let selectedIcon=store.getSelectedIcon()

  function sortByNewest(){
    store.loadIdNamePairs(store.getSelectedIcon(),"1",store.getSearchValue())
  }
  function sortByOldest(){
    store.loadIdNamePairs(store.getSelectedIcon(),"2",store.getSearchValue())
  }
  function sortByViews(){
    store.loadIdNamePairs(store.getSelectedIcon(),"3",store.getSearchValue())
  }
  function sortByLikes(){
    store.loadIdNamePairs(store.getSelectedIcon(),"4",store.getSearchValue())
  }
  function sortByDislikes(){
    store.loadIdNamePairs(store.getSelectedIcon(),"5",store.getSearchValue())
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}><SortIcon></SortIcon></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={sortByNewest}>
           Published Date (Newest)
        </MenuItem>
        <MenuItem onClick={sortByOldest}>
           Published Date (Oldest)
        </MenuItem>
        <Divider />
        <MenuItem onClick={sortByViews}>
          Views
        </MenuItem>
        <MenuItem onClick={sortByLikes}>
          Likes
        </MenuItem>
        <MenuItem onClick={sortByDislikes}>
          Dislikes
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
