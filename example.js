import Cycle from '@cycle/core';
import makeReactDriver from './src';
import React from 'react';

const TextInputCycle = (sources$) {
  return {
    ReactDriver: sources.inputChange$.map(ev => ev.currentTarget.value);
  };
}

const TextInput = (props) =>
  <div>
    <input type='text' value={props.value} placeholder={props.label} onChange={props.onInputChange} />
  </div>


const BmiDisplay = (props) => {
  <p>
    {props.bmi}
  </p>
}

const App = () => {
  <div>
    <TextInput label="weight" />
    <TextInput label="height" />
    <BmiDisplay>
  </div>
}

function main(sources) {
  return combine({ CycleSelector })(sources);
}

Cycle.run(main, {
  REACT: makeReactDriver(App, '#app'),
});

// <!html>
// <head><title>Test</title></head>
// <body>
//   <div id="app"></div>
// </body>
