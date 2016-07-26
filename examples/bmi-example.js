import { run } from '@cycle/rxjs-run';
import { makeDOMDriver } from '@cycle/dom';
import React from 'react';
import { makeCycleReactDriver, connect } from '../src';

/**
 * React tree.
 */
const Hello = (props) => <h1>{props.label}</h1>;
Hello.propTypes = {
  label: React.PropTypes.string.isRequired,
};
const ConnectedHello = connect()(Hello);

const App = () => <ConnectedHello label="pending" />;

/**
 * Cycle app
 */
const main = ({ DOM }) => {
  const counter$ = DOM.select('#app').events('click')
    .mapTo(1)
    .startWith(1)
    .scan((a, b) => a+b);

  return {
    react: counter$.map(c => ({ name: 'label', value: `Count: ${c}` })),
  };
};

/**
 * Run everything.
 */
const drivers = {
  react: makeCycleReactDriver(<App />, '#app'),
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);
