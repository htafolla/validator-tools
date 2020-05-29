import React, { Component, useCallback, useEffect, useState } from 'react'

class Search extends Component {



  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
      error: null
    }

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {

    
    this.loadData();
    setInterval(() => this.loadData(), 10000);
    //this.loadData();
  }

  componentWillUnmount() {

    clearInterval(this.interval);
  }

  loadData() {

    this.setState({ isLoading: true });

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
    .then((responseText) => {
      const validators = responseText.result.current_validators;
      this.setState({validators: validators, isLoading: false});
    })
    .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {

    const self = this

    const { validators, searchTerm, isLoading, error } = this.state;

    const handleChange = event => {
      this.setState({searchTerm: event.target.value});
      // console.log(event.target.value)
      // this.setState(() => ({
      //   searchTerm: event.target.value
      // }));
    };

    const results = !this.state.searchTerm
    ? validators
    : validators.filter(validator =>
      validator.account_id.toLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
      );

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>&nbsp;</p>;
    }

    return (

      <div className="App">

        <input
          type="text"
          placeholder="Search"
          value={this.state.searchTerm}
          onChange={handleChange} />

        <table>
          <thead>
            <tr>
              <th>Validator</th>
              <th>Expected</th>
              <th>Produced</th>
              <th>%</th>
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
}

export default Search;