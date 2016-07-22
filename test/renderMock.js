import { mount } from 'enzyme';
import sinon from 'sinon';

export default function makeRenderMock() {
  let wrapper;
  let mountPoint;

  function render(reactElement, selectorOrElement) {
    mountPoint = selectorOrElement;
    wrapper = mount(reactElement);
  }

  function getWrapper() {
    return wrapper;
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
