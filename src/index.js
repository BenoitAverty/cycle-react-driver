
export function makeCycleReactDriver(selector, component) {
  if (typeof component === 'undefined') {
    throw Error('Missing root component in makeCycleReactDriver');
  }

  if (typeof selector !== 'string') {
    throw new Error('Invalid selector');
  }

  return sinks => sinks;
}
