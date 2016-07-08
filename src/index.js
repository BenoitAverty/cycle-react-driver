import ReactDOM from 'react-dom';
import React from 'react';
import Rx from '@reactivex/rxjs';

export function makeCycleReactDriver(selector, component) {
  if (typeof component === 'undefined') {
    throw Error('Missing root component in makeCycleReactDriver');
  }

  if (typeof selector !== 'string') {
    throw new Error('Invalid selector');
  }

  function cycleReactDriver(sinks) {
    const observableProps = Object.keys(sinks)
      .map(k => sinks[k].map(prop => ({ [k]: prop })));

    Rx.Observable.combineLatest(...observableProps).subscribe(propsArray => {
      const props = propsArray.reduce((obj, curr) => ({ ...obj, ...curr }));

      ReactDOM.render(<component {...props} />, selector);
    });
  }

  return cycleReactDriver;
}
