/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import makeCycleReactDriver from '../src/makeCycleReactDriver';
import connect from '../src/connect';

import makeRenderMock from './utils/renderMock';
import Dummy from './utils/dummyComponent';

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
    it('Should render immediately when called', () => {
      const cycleReactDriver = makeCycleReactDriver(<Dummy />, '#app');

      cycleReactDriver();

      expect(renderMock.render).to.have.been.called;
    });

    it('Should render the component it was given', () => {
      const cycleReactDriver = makeCycleReactDriver(<Dummy />, '#app');

      cycleReactDriver();

      expect(renderMock.getWrapper()).to.contain(<Dummy />);
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

    it('Connected components should subscribe to Observables passed to the driver', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');
      const obs = { subscribe: sinon.spy() };

      cycleReactDriver({ obs });

      expect(obs.subscribe).to.have.been.called;
    });
  });
});
