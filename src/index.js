import React from 'react';
import ReactDOM from 'react-dom';
import getConfig from './config.js';
import {Account, Contract, WalletAccount, connect, keyStores, validators, utils  } from 'near-api-js';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';


// Initializing contract
async function initContract() {


    window.nearConfig = getConfig(process.env.NEAR_ENV || 'betanet')

    //console.log("nearConfig", window.nearConfig);

    // Initializing connection to the NEAR BetaNet.
    window.near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
    
    // Needed to access wallet login
    window.walletAccount = new WalletAccount(window.near);
    
    // Getting the Account ID. If unauthorized yet, it's just empty string.
    window.accountId = window.walletAccount.getAccountId();

    // Initializing our contract APIs by contract name and configuration.
    let acct = await new Account(window.near.connection, window.accountId);

    window.contract = await new Contract(acct, window.nearConfig.contractName, {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: ['welcome', 'getMessages'],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ['setGreeting', 'addMessage', 'removeValidator'],
        // Sender is the account ID to initialize transactions.
        sender: window.accountId
    });
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(
      <ThemeProvider theme={theme}> {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App near={window.near} contract={window.contract} wallet={window.walletAccount} />
      </ThemeProvider>,
    document.getElementById('root')
  );
}).catch(console.error)