/*global callFirstWith*/
callFirstWith = function (origin, prop, ...args) {
  let obj = this.getFirstWith(origin, prop);
  if (typeof obj[prop] === 'function') {
    return obj[prop](...args);
  } else {
    return obj[prop];
  }
};