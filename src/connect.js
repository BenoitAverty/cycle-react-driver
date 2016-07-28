import React from 'react';

/**
 * Returns true if the element is present in the array or if the array is undefined
 */
const safeContain = (array) => (element) => {
  if (array === undefined) {
    return true;
  }
  else {
    return array.indexOf(element) >= 0;
  }
};

const connect = (props) => (Component) => {
  class ConnectedComponent extends React.Component {
    componentDidMount() {
      if (this.context.cycleReactDriverObservable !== undefined) {
        this.context.cycleReactDriverObservable
          .filter(safeContain(props))
          .subscribe(
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
