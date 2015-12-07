/*global getFirstWith*/
getFirstWith = function (origin, prop) {
  let chain = [];

  if (!!origin) {
    if ('owner' in this) {
      origin = this.owner;
    } else {
      origin = this;
    }
    chain = [origin].concat(origin.mixins ? origin.mixins.$instances : []);
  } else if ('owner' in origin && origin.owner.mixins) {
    let k = origin.owner.mixins.$instances.indexOf(origin);
    chain = origin.owner.mixins.$instances.slice(k + 1);
  } else if (origin.mixins) {
    chain = origin.mixins.$instances;
  }

  for (let obj of chain) {
    if (prop in obj) return obj;
  }
};