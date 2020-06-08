import 'regenerator-runtime/runtime';
import React, { Component, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import logo from './assets/logo.svg';
import blazenetlogo from './assets/blazenet-io-icon.png';
import nearlogo from './assets/near_logo_wht.svg';
import near from './assets/near.svg';
import { utils } from 'near-api-js';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { Tooltip } from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { green } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

import './App.css';
import Signup from './Signup.js';
import Search from './Search.js';
import MenuAppBar from './AppBar.js';

//const merge = require('deepmerge')

class App extends Component {

  intervalID;


  constructor(props) {
    super(props);

    this.state = {

      login: false,
      balance: null,
      messages: null,
      balance: null,
      error: null,
      blockHeight: null,
      epoch: null,
      startHeight: null,
      isLoading: true,
      networkState: null,
      refreshValidators: false,
      seatPrice: null,
      nextSeatPrice: null,

    }

    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.loadData = this.loadData.bind(this);
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

    clearInterval(this.intervalID);

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
    
    //await this.welcome();
    await this.getMessages();
    this.loadData();

  }

  async getValidators() {

    // Get the additional EXPERIMENTAL params to calc seat price
    const genesisConfig = await this.props.near.connection.provider.sendJsonRpc('EXPERIMENTAL_genesis_config', {});
    console.log(genesisConfig);

    // Get validators
    const result = await this.props.near.connection.provider.sendJsonRpc('validators', [null]);
    result.genesisConfig = genesisConfig;
    result.numSeats = genesisConfig.num_block_producer_seats + genesisConfig.avg_hidden_validator_seats_per_shard.reduce((a, b) => a + b);

    return result;
  }

  async loadData() {

    const { findSeatPrice } = require('./validators.ts');

    console.log("Loading Data...");
    this.setState({ isLoading: true });

    // Get the Network State
    const networkState = await this.props.near.connection.provider.sendJsonRpc('status', {});
    console.log(networkState)
    this.setState({networkState: networkState});
    this.setState({blockHeight: networkState.sync_info.latest_block_height});

    // Get the Network State
    const validators  = await this.getValidators();
    console.log(validators)

    let findCurrentSeatPrice = findSeatPrice(validators.current_validators, validators.numSeats);
    let findNextSeatPrice = findSeatPrice(validators.next_validators, validators.numSeats);

    // Set state
    this.setState({startHeight: validators.epoch_start_height});
    this.setState({validators: validators, refreshValidators: true, isLoading: false});
    this.setState({seatPrice: utils.format.formatNearAmount(findCurrentSeatPrice.toString(), 0) });
    this.setState({nextSeatPrice: utils.format.formatNearAmount(findNextSeatPrice.toString(), 0)});


    // fetch( "https://rpc.betanet.nearprotocol.com", {
    //   method: 'POST',
    //   headers: new Headers({
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   }),
    //   body: JSON.stringify({
    //     jsonrpc: '2.0',
    //     id: 'none',
    //     method: 'validators',
    //     params: [null]
    //   })
    // })
    // .then(response => {
    //   if (response.ok) {
    //     return response.json();
    //   } else {
    //     throw new Error('Something went wrong ...');
    //   }
    // })
    // .then((data) => {

    //   //console.log(data.result)
    //   //console.log(data.result.current_validators)

    //   let currentValidators = data.result.current_validators;
    //     let nextValidators = data.result.next_validators.map((member) => {
    //         return {
    //             ...member,
    //             nextValidator: true
    //         }
    //   });

    //   this.intervalID = setTimeout(this.loadData.bind(this), 100000);

    // })
    // .catch(error => this.setState({ error, refreshValidators: false, isLoading: false }));
  }

  async getMessages() {

    this.setState({messages: await this.props.contract.getMessages()});

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

    const { networkState, validators, searchTerm, startHeight, blockHeight, refreshValidators, error, seatPrice, nextSeatPrice } = this.state;


    let loggedIn  = this.props.wallet.isSignedIn();


    let numBlocksProduced = (blockHeight - startHeight);
    let percentageComplete = numBlocksProduced / 10000;

    let epochPercent = Math.floor(percentageComplete * 100);

    let epoch = epochPercent;


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
        'min-height': 150,
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
      }
    }));

    function CenteredGrid() {

      const classes = useStyles();

      return (
        <div className={classes.root}>
          <Grid container spacing={5} alignItems="flex-start" alignContent="flex-start">

            <Grid item lg={12}>
              <MenuAppBar wallet={self.props.wallet} />
            </Grid>

            <Grid item lg={12} className={classes.gridItemCenter}>
              <Typography variant="h4" component="h4">
                NEAR VALIDATOR STATS & TOOLS
               </Typography>               
            </Grid>

            {(!loggedIn) && 
              <>
              <Grid item className={classes.gridItemCenter} lg={12}>
              <Typography variant="h6" component="h6">
              Login to use Validator tools<br/>
                <Button variant="contained" color="secondary" onClick={self.requestSignIn}>Log in</Button>
               </Typography>
                     </Grid>
               </>

            }
           {(loggedIn && validators) &&
              <>
            <Grid item className={classes.validators} lg={3} md={2} sm={1} >
              <Card className={classes.root } variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary"  variant="h6" component="h6">
                    {(validators.genesisConfig.chain_id).charAt(0).toUpperCase() + (validators.genesisConfig.chain_id).slice(1)}&nbsp;

                      {(validators.current_validators.length >= 67) ? (<Tooltip title={"Good " + validators.current_validators.length + " validators"} aria-label="Good"><CheckCircleIcon style={{ color: green[600] }} /></Tooltip> ) 
                      : (validators.current_validators.length < 67)
                      ? (<Tooltip title="Need validators" aria-label="Need validators"><ErrorIcon style={{ color: yellow[800] }} /></Tooltip> ) 
                      : (validators.length)}
      
                  </Typography>
                  <Typography variant="h5" component="h2">
                    Validators { validators.current_validators.length}
                  </Typography>
                  <Typography color="textSecondary">
                    Build: {networkState.version.build}
                  </Typography>
                  <Typography color="textSecondary">
                    Version: {networkState.version.version}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item className={classes.validators} lg={3} md={2} sm={1}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary"  variant="h6" component="h6">
                    EPOCH
                  </Typography>
                  <Typography variant="h5" component="h5">
                    &nbsp;{epoch}%
                  </Typography>
                  <Typography color="textSecondary">
                    Last block: {blockHeight}
                  </Typography>
                  <Typography color="textSecondary">
                   Start block: {startHeight}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item className={classes.validators} lg={3} md={2} sm={1}>
              <Card className={classes.scoreCard} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                     NEXT SEAT &nbsp; 
                    {
                      (nextSeatPrice > seatPrice)
                      ? <Tooltip title="Seat Price Up" aria-label="Good Standing"><ArrowUpwardIcon style={{ color: yellow[800] }} /></Tooltip> 
                      : <Tooltip title="Seat Price Down" aria-label="Seat Price Down"><ArrowDownwardIcon style={{ color: green[600] }} /></Tooltip>
                    }
                  </Typography>
                  <Typography variant="h5" component="h2">
                    &nbsp;{nextSeatPrice}
                  </Typography>
                  <Typography color="textSecondary">
                    Seat price: {seatPrice}
                  </Typography>
                  <Typography color="textSecondary">
                   &nbsp;
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item className={classes.validators} lg={3} md={2} sm={1}>
              <Card className={classes.root } variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary"  variant="h6" component="h6">
                    MY NODE
                  </Typography>
                  <Typography variant="h5" component="h2">
                    &nbsp;Coming Soon...
                  </Typography>
                  <Typography color="textSecondary">
                    HEALTH
                  </Typography>
                  <Typography color="textSecondary">
                    &nbsp;
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item className={classes.validators} lg={12}>
              <Search wallet={self.props.wallet} validators={self.state.validators} classes={classes} isLoading={self.state.isLoading} />
            </Grid>
                          </>
            }

          </Grid>
        </div>
      );
    }



    if (self.error) {
      return <p>{self.error.message}</p>;
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