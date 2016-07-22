import ReactDOM from 'react-dom';
import React from 'react';
// import Rx from '@reactivex/rxjs';

/**
 * Wrapper component that sets the observables in the react context so they are visible
 * by "connect".
 */
// class CycleWrapper extends React.Component {
//   getChildContext() {
//     return { cycleReactDriverObservables: this.props.observables };
//   }
//
//   render() {
//     return (
//       <div>
//         {this.props.children}
//       </div>
//     );
//   }
// }

const CycleWrapper = React.createClass({
  propTypes: {
    observables: React.PropTypes.object,
    children: React.PropTypes.element,
  },

  childContextTypes: {
    cycleReactDriverObservables: React.PropTypes.object,
  },

  getChildContext() {
    return { cycleReactDriverObservables: this.props.observables };
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  },
});


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
      <CycleWrapper observables={sinks}>
        {element}
      </CycleWrapper>
    );

    ReactDOM.render(tree, selector);
  }

  return cycleReactDriver;
}

export default (() => makeCycleReactDriver)();
