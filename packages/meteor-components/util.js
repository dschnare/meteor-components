/*global ComponentUtil*/
ComponentUtil = {};

// Wraps all functions in the funcMap by binding them
// to the thisObj. Returns a new object with the bound
// functions.
ComponentUtil.bindTo = function (funcMap, thisObj) {
  let o = {};
  for (let k in funcMap) {
    if (typeof funcMap[k] === 'function') {
      o[k] = funcMap[k].bind(thisObj);
    } else {
      o[k] = funcMap[k];
    }
  }
  return o;
};

// Determines if a string starts with a substring.
ComponentUtil.startsWith = function (str, start) {
  return str.length >= start.length &&
    str.substr(0, start.length) === start;
};