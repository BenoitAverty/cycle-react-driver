import ReactDOM from 'react-dom';
import React from 'react';

/**
 * Wrapper component that sets the observables in the react context so they are visible
 * by "connect".
 */
class CycleWrapper extends React.Component {
  getChildContext() {
    return { cycleReactDriverObservable: this.props.observable };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
CycleWrapper.propTypes = {
  observable: React.PropTypes.object,
  children: React.PropTypes.element,
};
CycleWrapper.childContextTypes = {
  cycleReactDriverObservable: React.PropTypes.object,
};

/**
 * Factory method for the cycle react driver.
 */
function makeCycleReactDriver(element, selector) {
  if (typeof element === 'undefined') {
    throw Error('Missing or invalid react element');
  }

  if (typeof selector !== 'string') {
    throw new Error('Missing or invalid selector');
  }

  function cycleReactDriver(sink) {
    const tree = (
      <CycleWrapper observable={sink}>
        {element}
      </CycleWrapper>
    );

    ReactDOM.render(tree, document.querySelector(selector));
  }

  return cycleReactDriver;
}

export default makeCycleReactDriver;
