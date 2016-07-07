/* eslint-env mocha */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import Rx from 'rxjs/Rx';

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
  });
});
