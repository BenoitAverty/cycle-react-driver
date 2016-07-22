/* eslint-env mocha */
import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import Rx from '@reactivex/rxjs';

import makeCycleReactDriver from '../src/makeCycleReactDriver';
import connect from '../src/connect';

import makeRenderMock from './renderMock';
import Dummy from './dummyComponent';

chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('makeCycleReactDriver', () => {
  it('should accept a selector and a jsx expression as input', () => {
    expect(() => makeCycleReactDriver(<Dummy />, '#app')).to.not.throw;
  });

  it('should return a function', () => {
    expect(makeCycleReactDriver(<Dummy />, '#app')).to.be.a('function');
  });

  it('should throw if there are less than two arguments', () => {
    expect(() => makeCycleReactDriver(<Dummy />)).to.throw(Error, /Missing or invalid selector/);
    expect(() => makeCycleReactDriver()).to.throw(Error, /Missing or invalid react element/);
  });

  it('should throw if the second argument is not a string', () => {
    expect(() => makeCycleReactDriver(<Dummy />, null)).to.throw(Error, /invalid selector/);
  });
});

describe('Cycle React Driver', () => {
  let renderMock;
  beforeEach(() => {
    renderMock = makeRenderMock();
    // eslint-disable-next-line no-underscore-dangle
    makeCycleReactDriver.__Rewire__('ReactDOM', { render: renderMock.render });
  });
  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    makeCycleReactDriver.__ResetDependency__('ReactDOM');
  });

  describe('Running the driver', () => {
    it('Should render the component immediately when called', () => {
      const cycleReactDriver = makeCycleReactDriver(<Dummy />, '#app');
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);

      expect(renderMock.render).to.have.been.calledWith(<Dummy />, '#app');
    });
  });

  describe('Rendering connected components', () => {
    it('Should render the components normally if the observables don\'t emit anything', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');

      cycleReactDriver();

      expect(renderMock.getWrapper()).to.contain(<Dummy />);
    });

    it('Should pass properties through if the observables don\'t emit anything', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy prop="prop" />, '#app');

      cycleReactDriver();

      expect(renderMock.getWrapper()).to.contain(<Dummy prop="prop" />);
    });
  });
});
