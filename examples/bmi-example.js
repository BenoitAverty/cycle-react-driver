import { run } from '@cycle/rxjs-run';
import { makeDOMDriver } from '@cycle/dom';
import React from 'react';
import { makeCycleReactDriver, connect } from '../src';
import Rx from 'rxjs';

/* eslint react/prop-types: "off" */

/**
 * React tree.
 */
const LabeledSlider = (props) => (
  <div className={props.className}>
    <label htmlFor={props.id}>{props.label}:</label>
    <input type="range" min={props.min} max={props.max} id={props.id} defaultValue={props.value} />
    <span>({props.value} {props.unit})</span>
  </div>
);

const BmiDisplay = (props) => (
  <h1>Your BMI is: <em>{Math.round(props.bmi*100)/100}</em></h1>
);
const ConnectedBmiDisplay = connect()(BmiDisplay);

const App = (props) => (
  <div>
    <ConnectedBmiDisplay />
    <LabeledSlider
      className="weight"
      label="Your Weight"
      min="10" max="110"
      id="weight"
      value={props.weight}
      unit="kg"
    />
    <LabeledSlider
      className="height"
      label="Your Height"
      min="100"
      max="250"
      id="height"
      value={props.height}
      unit="cm"
    />
  </div>
);
const ConnectedApp = connect()(App);

/**
 * Cycle app
 */
const main = ({ DOM }) => {
  const weight$ = DOM.select('.weight input')
    .events('input')
    .map(e => e.target.valueAsNumber)
    .startWith(65);
  const height$ = DOM.select('.height input')
    .events('input')
    .map(e => e.target.valueAsNumber)
    .startWith(170);
  const bmi$ = Rx.Observable.combineLatest(weight$, height$, (w, h) => w / (h*h/10000));

  const props$ = Rx.Observable.merge(
    weight$.map(value => ({ name: 'weight', value })),
    height$.map(value => ({ name: 'height', value })),
    bmi$.map(value => ({ name: 'bmi', value }))
  );

  return {
    react: props$,
  };
};

/**
 * Run everything.
 */
const drivers = {
  react: makeCycleReactDriver(<ConnectedApp />, '#app'),
  DOM: makeDOMDriver('#app'),
};

run(main, drivers);
