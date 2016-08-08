import React from 'react';

/* eslint react/no-multi-comp: "off", react/prop-types: "off" */

export default class Dummy extends React.Component {
  constructor() {
    super();
    this.state = { title: 'Title' };
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <pre>{JSON.stringify(this.props)}</pre>
      </div>
    );
  }
}
