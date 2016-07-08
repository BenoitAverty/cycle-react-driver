import React from 'react';

export default class Dummy extends React.Component {
  constructor() {
    super();
    this.state = { title: 'Title' };
  }

  render(props) {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <pre>{JSON.stringify(props)}</pre>
      </div>
    );
  }
}
