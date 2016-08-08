import React from 'react';

/**
 * Wrapper component that sets the observables in the react context so they are visible
 * by "connect".
 */
export default class CycleWrapper extends React.Component {
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
