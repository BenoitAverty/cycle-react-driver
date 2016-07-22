import ReactDOM from 'react-dom';
// import React from 'react';
// import Rx from '@reactivex/rxjs';

function makeCycleReactDriver(element, selector) {
  if (typeof element === 'undefined') {
    throw Error('Missing or invalid react element');
  }

  if (typeof selector !== 'string') {
    throw new Error('Missing or invalid selector');
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

export default makeCycleReactDriver;
