import 'regenerator-runtime/runtime';
import React, { Component, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import logo from './assets/logo.svg';
import blazenetlogo from './assets/blazenet-io-icon.png';
import nearlogo from './assets/near_logo_wht.svg';
import near from './assets/near.svg';
import * as nearlib from 'near-api-js';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';




import './App.css';
import Signup from './Signup.js';
import Search from './Search.js';
import MenuAppBar from './AppBar.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: false,
      balance: null,
      messages: null,
      balance: null,
      anchorEl: false

    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount() {

    let loggedIn = this.props.wallet.isSignedIn();

    
    if (loggedIn) {
      this.signedInFlow();

    } else {
      this.signedOutFlow();
    }
  }

  componentWillUnmount() {

  }

  async signedInFlow() {

    this.setState({
      login: true,
    })

    const accountId = await this.props.wallet.getAccountId()

    this.setState({balance: (await this.props.wallet.account().state()).amount});

    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    await this.welcome();
    await this.getMessages();

  }

  async getMessages() {

    this.setState({messages: await this.props.contract.getMessages()});

  }

  async welcome() {

    const response = await this.props.contract.welcome({ account_id: accountId });

  }

  async requestSignIn() {

    const appTitle = 'BlazeNet Validator Tools';

    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  requestSignOut() {

    this.props.wallet.signOut();

    setTimeout(this.signedOutFlow, 500);
  }

  async changeGreeting() {

    await this.props.contract.setGreeting({ message: 'howdy' });

    await this.welcome();
  }

  signedOutFlow() {

    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }

    this.setState({
      login: false,
    })

  }

  render() {

    self = this;

    const useStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
      },
      nearlogo: {
        'width': '25%',
        'vertical-align': 'middle',
      },
      logo: {
        'flex-grow': 1,
        'font-family': "'Catamaran', sans-serif",
        'font-weight': 600,
        'font-size': 45,
      },
      validators: {
        'min-height': 250,
        textAlign: 'left',
      },
      paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      gridItemRight: {
        'text-align': 'right',
      },
      gridItemCenter: {
        'text-align': 'center',
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
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
      },
      table: {
        minWidth: 650,
      },
    }));

    function CenteredGrid() {

      const classes = useStyles();

      return (
        <div className={classes.root}>
          <Grid container spacing={5} alignItems="flex-start" alignContent="flex-start">

            <Grid item xs={12}>
              <MenuAppBar wallet={self.props.wallet} />
            </Grid>

            <Grid item xs={12} className={classes.gridItemCenter}>
              <Typography variant="h4" component="h4">
                NEAR VALIDATOR STATS & TOOLS
               </Typography>
            </Grid>

            <Grid item className={classes.validators} xs={8}>
              <Search wallet={self.props.wallet} classes={classes} />
            </Grid>
            <Grid item xs={4}>
                  <Signup wallet={self.props.wallet} contract={self.props.contract} balance={self.state.balance} />
            </Grid>

            <Grid item  xs={12}>

            </Grid>

            <Grid item xs={3}>
              <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>xs=3</Paper>
            </Grid>
          </Grid>
        </div>
      );
    }

    return (
      <Container>
        <Box my={4}>
          <CenteredGrid />
        </Box>
      </Container>
      )
    }
  }

  App.propTypes = {
    contract: PropTypes.shape({
      addMessage: PropTypes.func.isRequired,
      getMessages: PropTypes.func.isRequired
    }).isRequired,
    wallet: PropTypes.shape({
      requestSignIn: PropTypes.func.isRequired,
      signOut: PropTypes.func.isRequired
    }).isRequired
  }

  export default App;