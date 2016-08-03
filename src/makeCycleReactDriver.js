import ReactDOM from 'react-dom';
import React from 'react';
import Rx from 'rxjs';
import RxJSAdapter from '@cycle/rxjs-adapter';

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

  const source$ = new Rx.ReplaySubject();
  const callback = (componentName) => (event) => {
    source$.next({
      event,
      componentName,
    });
  };

  function cycleReactDriver(sink) {
    const tree = (
      <CycleWrapper observable={sink} callback={callback}>
        {element}
      </CycleWrapper>
    );

    ReactDOM.render(tree, document.querySelector(querySelector));

    return {
      // Select function: use information passed in event to filter the stream then
      // map to the actual event.
      select: comp => source$.filter(e => e.componentName === comp.name).map(e => e.event),
    };
  }
  cycleReactDriver.streamAdapter = RxJSAdapter;

  return cycleReactDriver;
}

export default makeCycleReactDriver;
