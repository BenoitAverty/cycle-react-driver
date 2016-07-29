import ReactDOM from 'react-dom';
import React from 'react';
import Rx from 'rxjs';

/**
 * Wrapper component that sets the observables in the react context so they are visible
 * by "connect".
 */
class CycleWrapper extends React.Component {
  getChildContext() {
    return {
      cycleReactDriverObservable: this.props.observable,
      callback: this.props.callback,
    };
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
  callback: React.PropTypes.func,
  children: React.PropTypes.element,
};
CycleWrapper.childContextTypes = {
  cycleReactDriverObservable: React.PropTypes.object,
  callback: React.PropTypes.func,
};

/**
 * Factory method for the cycle react driver.
 */
function makeCycleReactDriver(element, querySelector) {
  if (typeof element === 'undefined') {
    throw Error('Missing or invalid react element');
  }

  if (typeof querySelector !== 'string') {
    throw new Error('Missing or invalid querySelector');
  }

  const source = new Rx.ReplaySubject();
  function callback(event) {
    source.next(event);
  }

  function cycleReactDriver(sink) {
    const tree = (
      <CycleWrapper observable={sink} callback={callback}>
        {element}
      </CycleWrapper>
    );

    ReactDOM.render(tree, document.querySelector(querySelector));

    return { select: () => source };
  }

  return cycleReactDriver;
}

export default makeCycleReactDriver;
