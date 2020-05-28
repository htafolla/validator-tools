import React, { Component, useCallback, useEffect, useState } from 'react'

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    }

  }

  render() {

    const validators = this.props.validators;

    const handleChange = event => {
      this.setState({searchTerm: event.target.value});
    };

    const results = !this.state.searchTerm
    ? validators
    : validators.filter(validator =>
      validator.account_id.toLowerCase().includes(this.state.searchTerm.toLocaleLowerCase())
      );

    if (!validators) {
      return "<p>Loading...</p>"
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
}

export default Search;