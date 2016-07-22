import React from 'react';

const connect = () => (Component) => {
  // class ConnectedComponent extends React.Component {
  //   render() {
  //     return <Component {...this.props} />;
  //   }
  // }

  const ConnectedComponent = React.createClass({
    componentDidMount() {
      const obs = this.context.cycleReactDriverObservables;
      if (obs !== undefined) {
        for (const key of Object.keys(obs)) {
          obs[key].subscribe();
        }
      }
    },

    render() {
      return <Component {...this.props} />;
    },
  });
  ConnectedComponent.contextTypes = {
    cycleReactDriverObservables: React.PropTypes.object,
  };

  return ConnectedComponent;
};

// Workaround for a weird bug in nyc. http://github.com/istanbuljs/nyc/issues/325
export default (() => connect)();
