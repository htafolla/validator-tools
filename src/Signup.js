import React, { Component, useCallback, useEffect, useState } from 'react'
import Big from 'big.js'

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(1).times(10 ** 12).toFixed()

class Signup extends Component {

  constructor(props) {
    super(props);
  }

  render() {

      const handleChange = event => {

        event.preventDefault()

        const { fieldset, message, donation } = event.target.elements;

        fieldset.disabled = true

        // update blockchain data in background
        // add uuid to each message, so we know which one is already known

        const result = self.props.contract.addMessage({ text: message.value },
          BOATLOAD_OF_GAS
        )
        .then(() => {

          self.props.contract.getMessages().then(messages => {

            self.setState({messages: messages});

            message.value = ''
            donation.value = SUGGESTED_DONATION
            fieldset.disabled = false
            message.focus()
          })
        })
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
                  max={Big(this.props.balance).div(10 ** 24)}
                  min="0"
                  step="0.01"
                  type="number"
                />
                <span title="NEAR Tokens">Ⓝ</span>
              </p>
              <button type="submit">Sign</button>
            </fieldset>
          </form>

          {!!this.props.messages && (
            <>
            <h2>Messages</h2>
            {this.props.messages.map((message, i) =>
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
}

export default Signup;