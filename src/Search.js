import React, { Component, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


class Search extends Component {

  intervalID;

  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
      error: null,
      blockHeight: null,
      epoch: null,
      startHeight: null
    }

    //this.loadData = this.loadData.bind(this);

  }

  componentDidMount() {

    this.loadData();

    //this.intervalID = setInterval(() => this.loadData(), 10000);
  }

  componentWillUnmount() {

    clearInterval(this.intervalID);
  }

  async loadData() {

    this.setState({ isLoading: true });

    this.setState({blockHeight: (await this.props.wallet.account().state()).block_height});

    fetch( "https://rpc.betanet.nearprotocol.com", {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'none',
        method: 'validators',
        params: [null]
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then((data) => {

      const validators = data.result.current_validators;

      this.setState({startHeight: data.result.epoch_start_height});

      this.setState({validators: validators, isLoading: false});

      this.intervalID = setTimeout(this.loadData.bind(this), 1000000);

    })
    .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {

    const self = this

    const { validators, searchTerm, startHeight, blockHeight,  isLoading, error } = this.state;

    let epoch = Math.floor((((blockHeight - startHeight) / 10000) * 100));

    const handleChange = () => {

      this.setState({searchTerm: event.target.value});
      
    };

    const results = !this.state.searchTerm
    ? validators
    : validators.filter(validator =>
      validator.account_id.toLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
      );

    //console.log(results)

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>&nbsp;</p>;
    }

    return (

      <div className="App">
        <Card className={self.props.classes.root}>
          <CardContent>
            <Typography className={self.props.classes.title} color="textSecondary" gutterBottom>
              EPOCH
            </Typography>
            <Typography variant="h5" component="h2">
              {epoch}%
            </Typography>
            <Typography color="textSecondary">
              complete
            </Typography>
          </CardContent>
        </Card>
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
              </TableRow>
            </TableHead>
            <TableBody key="vb">
             {results.map((validator, index) => (
                <TableRow key={index}>
                  <TableCell key="{`${validator.account_id}${index}`}" >{validator.account_id}</TableCell>
                  <TableCell key="{`${validator.num_expected_blocks}${index}`}" align="right">{JSON.stringify(validator.num_expected_blocks)}</TableCell>
                  <TableCell key="{`${validator.num_produced_blocks}${index}`}" align="right">{JSON.stringify(validator.num_produced_blocks)}</TableCell>
                  <TableCell key="{`${validator.num_expected_blocks}${validator.num_produced_blocks}${index}`}" align="right">{(validator.num_produced_blocks / validator.num_expected_blocks * 100).toFixed(2) + "%" }</TableCell>
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