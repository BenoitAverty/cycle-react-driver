import { shallow } from 'enzyme';
import sinon from 'sinon';

export default function makeRenderMock() {
  let wrapper;
  let mountPoint;

  function render(component, selectorOrElement) {
    mountPoint = selectorOrElement;
    wrapper = shallow(component);
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
