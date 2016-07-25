import React from 'react';

const connect = () => (Component) => {
  class ConnectedComponent extends React.Component {
    componentDidMount() {
      if (this.context.cycleReactDriverObservable !== undefined) {
        this.context.cycleReactDriverObservable.subscribe(
          this.propSubscritpion.bind(this)
        );
      }
    }

    propSubscritpion(prop) {
      if (prop.value) {
        this.setState({
          [prop.name]: prop.value,
        });
      }
      else if (this.props[prop.name]) {
        this.setState({
          [prop.name]: this.props[prop.name],
        });
      }
      else {
        this.setState({
          [prop.name]: undefined,
        });
      }
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }
  ConnectedComponent.contextTypes = {
    cycleReactDriverObservable: React.PropTypes.object,
  };

  return ConnectedComponent;
};

export default connect;
