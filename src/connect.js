import React from 'react';

const connect = () => (Component) => {
  // class ConnectedComponent extends React.Component {
  //   render() {
  //     return <Component {...this.props} />;
  //   }
  // }

  function ConnectedComponent(props) {
    return <Component {...props} />;
  }

  return ConnectedComponent;
};

// Workaround for a weird bug in nyc. http://github.com/istanbuljs/nyc/issues/325
export default (() => connect)();
