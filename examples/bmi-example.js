import { run } from '@cycle/rxjs-run';
import Rx from '@reactivex/rxjs';
import React from 'react';
import { makeCycleReactDriver, connect } from '../src';

const Hello = (props) => <h1>{props.label}</h1>;
Hello.propTypes = {
  label: React.PropTypes.string.required,
};

const ConnectedHello = connect()(Hello);

const App = () => <ConnectedHello />;

const main = () => ({
  react: {
    label: Rx.Observable.of('Hello, World!'),
  },
});


const drivers = {
  react: makeCycleReactDriver(<App />, '#app'),
};

console.log('Running app with cycle...');
run(main, drivers);
