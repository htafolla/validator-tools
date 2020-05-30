import React, { Component, useCallback, useEffect, useState } from 'react'
import Big from 'big.js'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(1).times(10 ** 12).toFixed()

class Signup extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let loggedIn = this.props.wallet.isSignedIn();

    //console.log(loggedIn)

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

  }

  render() {

      self = this;

      const handleChange = event => {

        event.preventDefault()

        const { fieldset, message, donation } = event.target.elements;

        fieldset.disabled = true

        // update blockchain data in background
        // add uuid to each message, so we know which one is already known

        const result = contract.addMessage({ text: message.value },
          BOATLOAD_OF_GAS
        )
        .then(() => {

          contract.getMessages().then(messages => {

            self.setState({messages: messages});

            console.log(messages)

            message.value = ''
            fieldset.disabled = false
            message.focus()
          })
        })
      };

      //console.log(self.props.wallet.isSignedIn())

      if(!self.props.wallet.isSignedIn()) {
        return <p>&nbsp;</p>
      }

      return (

        <div>
          <form onSubmit={handleChange} noValidate autoComplete="off">
            <fieldset id="fieldset">
               <Typography variant="h5" component="h5">
                Sign Up
               </Typography>
              <span>Be notified about validator issues</span>
              <TextField required id="message" label="Required" defaultValue="Email" autoComplete="off" />
              <Button variant="contained" color="primary">Sign Up</Button>
            </fieldset>
          </form>
        </div>
      );
    
  }
}

export default Signup;