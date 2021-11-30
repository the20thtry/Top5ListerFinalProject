
import { useContext, useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'



const BootstrapButton = styled(Button)({
position: 'relative',
height: '20%',
width: '80%',
margin:'2%',
borderRadius:35,
alignItems: 'center',
justifyContent: 'center',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: 'black',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  async function continueAsGuest(){

        auth.logIn({
          email: "Guest-reserved-email",
          password: "guest-password"
        }, store)
        let newUser =  await auth.registerUser({
          firstName: "Guest",
          lastName: " ",
          email: "Guest-reserved-email",
          password: "guest-password",
          passwordVerify: "guest-password",
      }, store);
      auth.user=newUser
    }

    return (
        <div id="splash-screen">
            <div style={{height:'12%'} }>
                <h1 style={{fontSize:50,color:'#00B4FF'} }>Welcome to the top5lister</h1> 
            </div> 

        <Link style={{textDecoration:'none'} } to='/login/' >
      <BootstrapButton variant="contained" disableRipple>
      <h1 style={{ color: '#00B4FF', fontSize:40} }>
         Log in </h1> 
      </BootstrapButton>
      </Link>

      <Link style={{textDecoration:'none'}} to='/register/'>
      <BootstrapButton variant="contained" disableRipple>
      <h1 style={{ color: '#00B4FF', fontSize:40 } }>
          Create New account 
          </h1> 
      </BootstrapButton>
      </Link>

        <Link to='/register/' style={{textDecoration:'none'}}>
      <BootstrapButton variant="contained" disableRipple onClick={continueAsGuest}>
      <h1 style={{ color: '#00B4FF', fontSize:40} }>
          Continue as Guest(WIP) </h1> 
      </BootstrapButton>
      </Link>

      <div id ="made-by-Derek-Ding"> </div>
        <h1 style={{fontSize:15,color:'#00FAF6',textAlign:"right", marginRight:40} }>Made by Derek Ding</h1> 
        </div>

    )
}