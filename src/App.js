import 'regenerator-runtime/runtime';
import React, { Component, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
import * as nearlib from 'near-api-js';
import './App.css';
import Signup from './Signup.js';
import Search from './Search.js';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      validators: null,
      balance: null,
      messages: null
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount() {

    fetch( "https://rpc.betanet.nearprotocol.com", {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '123',
        method: 'query',
        params: {request_type: 'view_state', finality: 'final', account_id: 'blazenet', prefix_base64: 'U1RBVEU='}
      }) // <-- Post parameters
    })
    .then((response) => response.json())
    .then((responseText) => {

      //console.log(responseText);
      //console.log(JSON.parse(JSON.stringify(responseText.result.values)));
    })
    .catch((error) => {
      console.error(error);
    });

    setInterval(() => this.loadData(), 180000);

    let loggedIn = this.props.wallet.isSignedIn();
    
    if (loggedIn) {
      this.signedInFlow();

    } else {
      this.signedOutFlow();
    }
  }

  componentWillUnmount() {

    clearInterval(this.interval);
  }

  async signedInFlow() {

    this.setState({
      login: true,
    })

    const accountId = await this.props.wallet.getAccountId()

    this.setState({balance: (await this.props.wallet.account().state()).amount});

    //console.log(balance)
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    await this.welcome();
    await this.validators();
    await this.getMessages();

  }

  async loadData() {

    console.log("Loading data...")
    await this.validators();
  }

  async validators() {

    try {
      const nodeStatus =  await window.near.connection.provider.validators();
      const validators  = JSON.stringify(nodeStatus);
      this.setState({validators: nodeStatus.current_validators});
    } catch (ex) {
      console.error(ex);
    }
  }

  async getMessages() {

    this.setState({messages: await this.props.contract.getMessages()});

    console.log(this.state.messages)

  }

  async welcome() {

    const response = await this.props.contract.welcome({ account_id: accountId });

    this.setState({speech: response.text});

  }

  async requestSignIn() {

    const appTitle = 'Validator Tools';

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
      speech: null
    })

  }

  render() {

    const self = this;

      let style = {
        fontSize: "1.5rem",
        color: "#0072CE",
        textShadow: "1px 1px #D1CCBD"
      }

      if (!this.state.validators) {
        return "<p>Loading...</p>"
      }

      return (

        <div>
          <div className="App-header">
            <div className="image-wrapper">
              <img className="logo" src={nearlogo} alt="NEAR logo" />
              <p style={style}>{this.state.speech}</p> 
            </div>

            <div>
              {this.state.login ? 
                <div>
                <button onClick={this.requestSignOut}>Log out</button>
                <button onClick={this.changeGreeting}>Change greeting</button>
                </div>
                : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
            </div>
          </div>

          <div className="App-body">
            <Signup balance={self.state.balance} messages={self.state.messages} />
            <Search validators={self.state.validators} />
          </div>

        </div>
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
