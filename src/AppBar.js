import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import blazenetlogo from './assets/blazenet-io-icon.png';
import nearlogo from './assets/near_logo_wht.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    'flex-grow': 1,
    'font-family': "'Catamaran', sans-serif",
    'font-weight': 600,
    'font-size': 45,
  },
  nearlogo: {
    'vertical-align': 'middle',
  },
  headerText: {
    'font-size': '1.2rem',
    'vertical-align': 'middle'
  },
  alignRight: {
    'text-align': 'right',
  },
  alignLeft: {
    'text-align': 'left',
  }
}));

export default function MenuAppBar(props) {
  

  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  let loggedIn = props.wallet.isSignedIn();


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.logo}  variant="h1" component="h1">BlazeNet</Typography>
          <div className={classes.alignRight}>
          {auth && (
            <div>
                 <img className={classes.nearlogo} src={nearlogo} alt="NEAR logo" width="25%" />&nbsp;
                 {loggedIn ? 
                  <span className={classes.headerText}>
                  @{accountId}                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                  </span>
                  : ''}


                {loggedIn ? 
                    <span>
                    &nbsp;<Button  variant="contained" color="secondary" onClick={self.requestSignOut}>Log Out</Button>
                    </span>
                    : <Button variant="contained" color="secondary" onClick={self.requestSignIn}>Log in</Button>}
            </div>
          
          )}
           </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
