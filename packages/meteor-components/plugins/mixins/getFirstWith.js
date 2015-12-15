/*global getFirstWith*/
getFirstWith = function (origin, prop) {
  let chain = [];

  if (!!origin) {
    if ('owner' in this) {
      origin = this.owner;
    } else {
      origin = this;
    }
    chain = [origin].concat(origin.mixins ? origin._mixinInstances : []);
  } else if ('owner' in origin && origin.owner.mixins) {
    let k = origin.owner._mixinInstances.indexOf(origin);
    chain = origin.owner._mixinInstances.slice(k + 1);
  } else if (origin.mixins) {
    chain = origin._mixinInstances;
  }

  for (let obj of chain) {
    if (prop in obj) return obj;
  }
};