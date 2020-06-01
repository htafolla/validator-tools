import React from 'react';
import ReactDOM from 'react-dom';
import getConfig from './config.js';
import * as nearlib from 'near-api-js';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

// Initializing contract
async function initContract() {

    window.nearConfig = getConfig(process.env.NODE_ENV || 'development')
    //console.log("nearConfig", window.nearConfig);

    // Initializing connection to the NEAR DevNet.
    window.near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
    
    // Needed to access wallet login
    window.walletAccount = new nearlib.WalletAccount(window.near);

    window.nodeStatus = await near.connection.provider.validators();
    
    // Getting the Account ID. If unauthorized yet, it's just empty string.
    window.accountId = window.walletAccount.getAccountId();

    // Initializing our contract APIs by contract name and configuration.
    let acct = await new nearlib.Account(window.near.connection, window.accountId);
    window.contract = await new nearlib.Contract(acct, window.nearConfig.contractName, {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: ['welcome', 'getMessages'],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ['setGreeting', 'addMessage'],
        // Sender is the account ID to initialize transactions.
        sender: window.accountId
    });
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(
      <ThemeProvider theme={theme}> {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App contract={window.contract} wallet={window.walletAccount} nodeStatus={window.nodeStatus} />
      </ThemeProvider>,
    document.getElementById('root')
  );
}).catch(console.error)