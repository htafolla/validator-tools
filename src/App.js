import 'regenerator-runtime/runtime';
import React, { Component, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Big from 'big.js'
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
import * as nearlib from 'near-api-js';
import './App.css';

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(1).times(10 ** 12).toFixed()

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

    function SignUp() {

      const handleChange = event => {

        event.preventDefault()

        const { fieldset, message, donation } = event.target.elements;

        //console.log(message.value)
        //console.log(donation.value)

        fieldset.disabled = true

        //console.log("form disabled")

        // TODO: optimistically update page with new message,
        // update blockchain data in background
        // add uuid to each message, so we know which one is already known

        const result = self.props.contract.addMessage({ text: message.value },
          BOATLOAD_OF_GAS
          ).then(() => {

            self.props.contract.getMessages().then(messages => {
              self.setState({messages: messages});

              message.value = ''
              donation.value = SUGGESTED_DONATION
              fieldset.disabled = false
              message.focus()
            })
          })

          //console.log(result)
          //console.log("after addMessage")
        };

        return (

          <div>
            <form onSubmit={handleChange}>
              <fieldset id="fieldset">
                <p>Sign the guest book, { accountId }!</p>
                <p className="highlight">
                  <label htmlFor="message">Message:</label>
                  <input
                  autoComplete="off"
                  autoFocus
                  id="message"
                  required
                  />
                </p>
                <p>
                  <label htmlFor="donation">Donation (optional):</label>
                  <input
                    autoComplete="off"
                    defaultValue={SUGGESTED_DONATION}
                    id="donation"
                    max={Big(self.state.balance).div(10 ** 24)}
                    min="0"
                    step="0.01"
                    type="number"
                  />
                  <span title="NEAR Tokens">Ⓝ</span>
                </p>
                <button type="submit">Sign</button>
              </fieldset>
            </form>

            {!!self.state.messages && (
              <>
              <h2>Messages</h2>
              {self.state.messages.map((message, i) =>
                // TODO: format as cards, add timestamp
                <p key={i} className={message.premium ? 'is-premium' : ''}>
                  <strong>{message.sender}</strong>:<br/>
                  {message.text}
                </p>
                )}
              </>
            )}
          </div>
        );
      }

      function Search() {

        const validators = self.state.validators;

        const [searchTerm, setSearchTerm] = React.useState("");

        const handleChange = event => {
          setSearchTerm(event.target.value);
        };

        const results = !searchTerm
        ? validators
        : validators.filter(person =>
          person.account_id.toLowerCase().includes(searchTerm.toLocaleLowerCase())
          );

        if (!validators) {
          return "<p>Loading...</p>"
        }

        return (

          <div className="App">

            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange} />

            <table>
              <thead>
                <tr>
                  <th>Validator</th>
                  <th>Expected</th>
                  <th>Produced</th>
                  <th>Risk %</th>
                </tr>
              </thead>
              <tbody>
                {results.map(((validator, index) =>
                  <tr key={index}>
                      <td key="{`${validator.account_id}${index}`}">{validator.account_id}</td>
                      <td key="{`${validator.num_expected_blocks}${index}`}">{JSON.stringify(validator.num_expected_blocks)}</td>
                      <td key="{`${validator.num_produced_blocks}${index}`}">{JSON.stringify(validator.num_produced_blocks)}</td>
                      <td key="{`${validator.num_expected_blocks}${validator.num_produced_blocks}${index}`}">{ Math.floor(validator.num_produced_blocks / validator.num_expected_blocks * 100) + "%" }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

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
            <SignUp />
            <Search />
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
