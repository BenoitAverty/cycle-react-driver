import ReactDOM from 'react-dom';
import React from 'react';
import Rx from 'rxjs';

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
 * The driver will receive several observables representing props to send to connected components.
 * This function converts all observables into a single observable, and adds to each event a
 * "propName" attribute to remember the name of the prop.
 * exemple:
 * prop1: ---------------------------------a-----------------
 * prop2: ---x-----------------------------------------------
 *        mergeAllObservables(prop1, prop2)
 *        ---{name:'prop2', value:x}-------{name:'prop1', value: a}---
 */
function mergeAllObservables(observables) {
  const namedObs = [];

  if (observables === undefined) {
    return Rx.Observable.empty();
  }

  for (const k of Object.keys(observables)) {
    namedObs.push(observables[k].map(p => ({ name: k, value: p })));
  }

  return namedObs.reduce((acc, curr) => acc.merge(curr), Rx.Observable.empty());
}

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

  function cycleReactDriver(sinks) {
    const tree = (
      <CycleWrapper observable={mergeAllObservables(sinks)}>
        {element}
      </CycleWrapper>
    );

    ReactDOM.render(tree, selector);
  }

  return cycleReactDriver;
}

export default makeCycleReactDriver;
