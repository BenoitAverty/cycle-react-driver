import ReactDOM from 'react-dom';
// import React from 'react';
// import Rx from '@reactivex/rxjs';

export function makeCycleReactDriver(selector, element) {
  if (typeof element === 'undefined') {
    throw Error('Missing root jsx expression in makeCycleReactDriver');
  }

  if (typeof selector !== 'string') {
    throw new Error('Invalid selector');
  }

  function cycleReactDriver() {
    // const observableProps = Object.keys(sinks)
    //   .map(k => sinks[k].map(prop => ({ [k]: prop })));

    // Rx.Observable.combineLatest(...observableProps).subscribe(propsArray => {
    //   const props = propsArray.reduce((obj, curr) => ({ ...obj, ...curr }));
    //
    //   ReactDOM.render(React.cloneElement(element, props), selector);
    // });

    ReactDOM.render(element, selector);
  }

  return cycleReactDriver;
}
