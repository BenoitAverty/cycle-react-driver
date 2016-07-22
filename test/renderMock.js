import { shallow } from 'enzyme';
import sinon from 'sinon';

export default function makeRenderMock() {
  let wrapper;
  let mountPoint;

  function render(reactElement, selectorOrElement) {
    mountPoint = selectorOrElement;
    wrapper = shallow(reactElement);
  }

  /**
   * Retrieve the shallow wrapper rendered at specified depth
   */
  function getWrapper(depth = 0) {
    if (depth === 0) {
      return wrapper;
    }

    let wrapperAtDepth = wrapper;
    for (let i = 0; i < depth; ++i) {
      wrapperAtDepth = wrapperAtDepth.shallow();
    }

    return wrapperAtDepth;
  }

  function getMountPoint() {
    return mountPoint;
  }

  return {
    render: sinon.spy(render),
    getWrapper,
    getMountPoint,
  };
}
