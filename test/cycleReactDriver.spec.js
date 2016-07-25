/* eslint-env mocha */
import React from 'react';
import Rx from 'rxjs';
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

    it('Should trigger a subscribtion to Observables passed to the driver', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');
      const obs = new Rx.Subject();
      sinon.spy(obs, 'subscribe');

      cycleReactDriver({ obs });

      expect(obs.subscribe).to.have.been.called;
    });

    it('Should send observable values as props to wrapped components', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');
      const obs = new Rx.Subject();

      cycleReactDriver({ obs });
      expect(renderMock.getWrapper()).to.contain(<Dummy />);
      obs.next('value');
      expect(renderMock.getWrapper()).to.contain(<Dummy obs="value" />);
    });

    it('Should send multiple observables values as props to wrapped component', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');
      const obs1 = new Rx.Subject();
      const obs2 = new Rx.Subject();

      cycleReactDriver({ obs1, obs2 });
      expect(renderMock.getWrapper()).to.contain(<Dummy />);
      obs1.next('value1');
      obs2.next('value2');
      expect(renderMock.getWrapper()).to.contain(<Dummy obs1="value1" obs2="value2" />);
    });

    it('Should keep original props on components', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy original="prop" />, '#app');
      const obs = Rx.Observable.of('value');

      cycleReactDriver({ obs });
      expect(renderMock.getWrapper().find(Dummy)).to.have.prop('original', 'prop');
    });

    it('Should give priority to props from the driver', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy prop="original" />, '#app');
      const prop = Rx.Observable.of('overriden');

      cycleReactDriver({ prop });
      expect(renderMock.getWrapper().find(Dummy)).to.have.prop('prop', 'overriden');
    });

    it('Should use original properties if the observable emits undefined', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy prop="original" />, '#app');
      const prop = new Rx.Subject();

      cycleReactDriver({ prop });
      prop.next('some value');
      prop.next(undefined);
      expect(renderMock.getWrapper().find(Dummy)).to.have.prop('prop', 'original');
    });
    it('Shouldn\'t render a prop from the driver if its value is undefined', () => {
      const ConnectedDummy = connect()(Dummy);
      const cycleReactDriver = makeCycleReactDriver(<ConnectedDummy />, '#app');
      const prop = new Rx.Subject();

      cycleReactDriver({ prop });
      prop.next('some value');
      prop.next(undefined);
      expect(renderMock.getWrapper().find(Dummy)).to.not.have.prop('prop');
    });
  });
});
