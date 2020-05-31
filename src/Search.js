import React, { Component, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import WarningIcon from '@material-ui/icons/Warning';
import { Tooltip } from '@material-ui/core';


class Search extends Component {

  intervalID;

  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
      // error: null,
      // epoch: null,
      // startHeight: null
    }

  }

  componentDidMount() {

    //this.loadData();

    //this.intervalID = setInterval(() => this.loadData(), 10000);
  }

  componentWillUnmount() {

    //clearInterval(this.intervalID);
  }

  // async loadData() {

  //   this.setState({ isLoading: true });

  //   this.setState({blockHeight: (await this.props.wallet.account().state()).block_height});

  //   fetch( "https://rpc.betanet.nearprotocol.com", {
  //     method: 'POST',
  //     headers: new Headers({
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     }),
  //     body: JSON.stringify({
  //       jsonrpc: '2.0',
  //       id: 'none',
  //       method: 'validators',
  //       params: [null]
  //     })
  //   })
  //   .then(response => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       throw new Error('Something went wrong ...');
  //     }
  //   })
  //   .then((data) => {

  //     const validators = data.result.current_validators;

  //     this.setState({startHeight: data.result.epoch_start_height});

  //     this.setState({validators: validators, isLoading: false});

  //     this.intervalID = setTimeout(this.loadData.bind(this), 10000);

  //   })
  //   .catch(error => this.setState({ error, isLoading: false }));
  // }

  render() {

    const self = this

    //const { validators, searchTerm, startHeight, blockHeight,  isLoading, error } = this.state;

    const { searchTerm, refreshValidators, isLoading } = self.props;

    if(isLoading) {
      return <p>Loading...</p>;
    }

    const validators = self.props.validators.current_validators;

    //console.log(validators)


    //let epoch = Math.floor((((blockHeight - startHeight) / 10000) * 100));

    const handleChange = () => {

      this.setState({searchTerm: event.target.value});
      
    };

    const results = !this.state.searchTerm
    ? validators
    : validators.filter(validator =>
      validator.account_id.toLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
      );

    //console.log(results)

    // if (error) {
    //   return <p>{error.message}</p>;
    // }



    return (

      <div className="App">

        <TextField
          id="search"
          value={this.state.searchTerm}
          onChange={handleChange}
          label="Search Validators"
          variant="outlined"
        />

        <TableContainer component={Paper}>
          <Table className={self.props.classes.table} aria-label="simple table">
            <TableHead key="th">
              <TableRow key="tr">
                <TableCell key="v">Validator</TableCell>
                <TableCell key="b" align="right">Blocks Expected</TableCell>
                <TableCell key="p" align="right">Blocks Produced</TableCell>
                <TableCell key="pc" align="right">%</TableCell>
                <TableCell key="k" align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody key="vb">
             {results.map((validator, index) => (
                <TableRow key={index}>
                  <TableCell key="{`${validator.account_id}${index}`}" >{validator.account_id}</TableCell>
                  <TableCell key="{`${validator.num_expected_blocks}${index}`}" align="right">{JSON.stringify(validator.num_expected_blocks)}</TableCell>
                  <TableCell key="{`${validator.num_produced_blocks}${index}`}" align="right">{JSON.stringify(validator.num_produced_blocks)}</TableCell>
                  <TableCell key="{`${validator.num_expected_blocks}${validator.num_produced_blocks}${index}`}" align="right">{(validator.num_produced_blocks / validator.num_expected_blocks * 100).toFixed(2) + "%" }</TableCell>
                  <TableCell key="" align="right">{!(((validator.num_produced_blocks / validator.num_expected_blocks * 100).toFixed()) > 90) && ( <Tooltip title="Blocks Low" aria-label="Blocks Low"><WarningIcon color="primary" /></Tooltip>)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
    );
  }
}

export default Search;