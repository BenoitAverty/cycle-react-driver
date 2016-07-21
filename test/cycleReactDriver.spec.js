/* eslint-env mocha */
import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import Rx from '@reactivex/rxjs';

import makeDriverRewireAPI, { makeCycleReactDriver } from '../src';

import makeRenderMock from './renderMock';
import Dummy from './dummyComponent';

chai.use(sinonChai);

describe('cycle-react-driver', () => {
  describe('makeCycleReactDriver', () => {
    it('should accept a selector and a jsx expression as input', () => {
      expect(() => makeCycleReactDriver('#app', <Dummy />)).to.not.throw;
    });

    it('should return a function', () => {
      expect(makeCycleReactDriver('#app', <Dummy />)).to.be.a('function');
    });

    it('should throw if there are less than two arguments', () => {
      expect(() => makeCycleReactDriver('#app')).to.throw(Error, /Missing root jsx expression/);
    });

    it('should throw if the first argument is not a string', () => {
      expect(() => makeCycleReactDriver(null, <Dummy />)).to.throw(Error, /Invalid selector/);
    });
  });

  describe('Cycle React Driver', () => {
    let renderMock;
    beforeEach(() => {
      renderMock = makeRenderMock();
      // eslint-disable-next-line no-underscore-dangle
      makeDriverRewireAPI.__Rewire__('ReactDOM', { render: renderMock.render });
    });
    afterEach(() => {
      // eslint-disable-next-line no-underscore-dangle
      makeDriverRewireAPI.__ResetDependency__('ReactDOM');
    });

    it('Should render the component immediately when called', () => {
      const cycleReactDriver = makeCycleReactDriver('#app', <Dummy />);
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);

      expect(renderMock.render).to.have.been.calledWith(<Dummy />, '#app');
    });

    it.skip('Should call the render function when an observable passed as input emits an event',
    () => {
      const cycleReactDriver = makeCycleReactDriver('#app', <Dummy />);
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);
      sinks.test.next('value');

      expect(renderMock.render).to.have.been.calledWith(<Dummy test="value " />, '#app');
    });

    it.skip('Should render the component with the value of the observable', () => {
      const cycleReactDriver = makeCycleReactDriver('#app', <Dummy />);
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);
      sinks.test.next('value');

      expect(renderMock.getWrapper().prop('test')).to.equal('value');
    });

    it.skip('Should handle several observables', () => {
      const cycleReactDriver = makeCycleReactDriver('#app', <Dummy />);
      const sinks = {
        prop1: new Rx.Subject(),
        prop2: new Rx.Subject(),
      };

      cycleReactDriver(sinks);
      sinks.prop1.next('value 1');
      sinks.prop2.next('value 2');

      expect(renderMock.getWrapper().props()).to.have.keys('prop1', 'prop2', 'children');
      expect(renderMock.getWrapper().prop('prop1')).to.equal('value 1');
      expect(renderMock.getWrapper().prop('prop2')).to.equal('value 2');
    });

    it.skip('Shouldn\'t remove props given in the original jsx expression', () => {
      const cycleReactDriver = makeCycleReactDriver('#app', <Dummy origin="origin" />);
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);
      sinks.test.next('value');

      expect(renderMock.getWrapper().props()).to.have.keys('test', 'origin', 'children');
      expect(renderMock.getWrapper().prop('origin')).to.equal('origin');
    });

    it.skip('Should remove props when the corresponding Observable emits null or undefined');

    it.skip('Should override props the original expression when the sinks contain the same name');

    it.skip('Should go back to default props value when observable emits undefined or null');
  });
});
