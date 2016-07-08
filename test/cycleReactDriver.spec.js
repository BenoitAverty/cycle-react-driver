/* eslint-env mocha */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import Rx from '@reactivex/rxjs';

import makeDriverRewireAPI, { makeCycleReactDriver } from '../src';

import makeRenderMock from './renderMock';
import Dummy from './dummyComponent';

chai.use(sinonChai);

describe('cycle-react-driver', () => {
  describe('makeCycleReactDriver', () => {
    it('should accept a selector and a React component as input', () => {
      expect(() => makeCycleReactDriver('#app', Dummy)).to.not.throw;
    });

    it('should return a function', () => {
      expect(makeCycleReactDriver('#app', Dummy)).to.be.a('function');
    });

    it('should throw if there are less than two arguments', () => {
      expect(() => makeCycleReactDriver('#app')).to.throw(Error, /Missing root component/);
    });

    it('should throw if the first argument is not a string', () => {
      expect(() => makeCycleReactDriver(null, Dummy)).to.throw(Error, /Invalid selector/);
    });
  });

  describe('Cycle React Driver', () => {
    let cycleReactDriver;
    let renderMock;
    beforeEach(() => {
      cycleReactDriver = makeCycleReactDriver('#app', Dummy);
      renderMock = makeRenderMock();
      // eslint-disable-next-line no-underscore-dangle
      makeDriverRewireAPI.__Rewire__('ReactDOM', { render: renderMock.render });
    });
    afterEach(() => {
      // eslint-disable-next-line no-underscore-dangle
      makeDriverRewireAPI.__ResetDependency__('ReactDOM');
    });

    it('Shouldn\'t render the component immediately when called', () => {
      const sinks = { test: new Rx.Subject() };
      cycleReactDriver(sinks);
      expect(renderMock.render).to.not.have.been.called;
    });

    it('Should call the render function when an observable passed as input emits an event', () => {
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);
      sinks.test.next('value');
      expect(renderMock.render).to.have.been.called;
    });

    it('Should render the component with the value of the observable', () => {
      const sinks = { test: new Rx.Subject() };

      cycleReactDriver(sinks);
      sinks.test.next('value');
      expect(renderMock.getWrapper().prop('test')).to.equal('value');
    });

    it('Should handle several observables', () => {
      const sinks = {
        prop1: new Rx.Subject(),
        prop2: new Rx.Subject(),
      };

      cycleReactDriver(sinks);

      sinks.prop1.next('value 1');
      sinks.prop2.next('value 2');

      expect(renderMock.getWrapper().props()).to.deep.equal({
        prop1: 'value 1',
        prop2: 'value 2',
      });
    });
  });
});
