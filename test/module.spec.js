/* eslint-env mocha */
import { expect } from 'chai';
import Dummy from './dummyComponent';

import { makeCycleReactDriver } from '../src';

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
});
