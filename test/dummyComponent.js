import React from 'react';

export default class Dummy extends React.Component {
  getInitialState() {
    return 'state';
  }

  render(props) {
    return (
      <div>
        <h1>{this.state}</h1>
        <pre>{JSON.stringify(props)}</pre>
      </div>
    );
  }
}
