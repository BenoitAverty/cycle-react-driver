import React from 'react';

/**
 * Returns true if the element is present in the array or if the array is undefined
 */
const includedProp = (includedProps) => (element) => {
  if (includedProps === undefined) {
    return true;
  }
  else {
    return includedProps.indexOf(element.name) >= 0;
  }
};

const connect = (propsToPass, callbackName) => (Component) => {
  class ConnectedComponent extends React.Component {
    componentDidMount() {
      if (this.context.cycleReactDriverObservable !== undefined) {
        this.context.cycleReactDriverObservable
          .filter(includedProp(propsToPass))
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
      const childProps = {
        ...this.props,
        ...this.state,
      };
      if (typeof callbackName === 'string' && callbackName.length > 0) {
        childProps[callbackName] = this.context.callback;
      }

      return <Component {...childProps} />;
    }
  }
  ConnectedComponent.contextTypes = {
    cycleReactDriverObservable: React.PropTypes.object,
    callback: React.PropTypes.func,
  };

  return ConnectedComponent;
};

export default connect;
