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
import { Tooltip } from '@material-ui/core';

import WarningIcon from '@material-ui/icons/Warning';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ErrorIcon from '@material-ui/icons/Error';


import { green } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';


class Search extends Component {

  intervalID;

  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
    }

  }

  componentDidMount() {

  }

  componentWillUnmount() {


  }

  render() {

    const self = this

    const { searchTerm, refreshValidators, isLoading } = self.props;

    if(isLoading) {
      return <p>Loading...</p>;
    }

    const validators = self.props.validators.current_validators;

    const handleChange = () => {

      this.setState({searchTerm: event.target.value});
      
    };

    const results = !this.state.searchTerm
    ? validators
    : validators.filter(validator =>
      validator.account_id.toLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
      );

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
                <TableCell className={self.props.classes.hideTableCell} key="b" align="right">Blocks Expected</TableCell>
                <TableCell className={self.props.classes.hideTableCell} key="p" align="right">Blocks Produced</TableCell>
                <TableCell key="pc" align="right">%</TableCell>
                <TableCell key="k" align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody key="vb">
             {results.map((validator, index) => (
                <TableRow key={index}>
                  <TableCell key="{`${validator.account_id}${index}`}" >{validator.account_id}</TableCell>
                  <TableCell className={self.props.classes.hideTableCell} key="{`${validator.num_expected_blocks}${index}`}" align="right">{JSON.stringify(validator.num_expected_blocks)}</TableCell>
                  <TableCell className={self.props.classes.hideTableCell} key="{`${validator.num_produced_blocks}${index}`}" align="right">{JSON.stringify(validator.num_produced_blocks)}</TableCell>
                  <TableCell key="{`${validator.num_expected_blocks}${validator.num_produced_blocks}${index}`}" align="right">{(validator.num_produced_blocks / validator.num_expected_blocks * 100).toFixed(2) + "%" }</TableCell>
                  <TableCell key="" align="right">
                    {
                      ((validator.num_expected_blocks - validator.num_produced_blocks) >= 10) ? (<Tooltip title="Kicked not enough blocks" aria-label="Kicked not enough blocks"><ErrorIcon style={{ color: red[600] }} /></Tooltip> ) 
                      : (((validator.num_produced_blocks / validator.num_expected_blocks * 100).toFixed()) >= 90)
                      ? (<Tooltip title="Good Standing" aria-label="Good Standing"><CheckBoxIcon style={{ color: green[600] }} /></Tooltip> ) 
                      : (<Tooltip title="Blocks Low" aria-label="Blocks Low"><WarningIcon style={{ color: yellow[800] }} /></Tooltip> )
                    }
                  </TableCell>
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