/*global instantiateMixin, getFirstWith, callFirstWith*/
instantiateMixin = function (Mixin, owner) {
  let mixin;

  if (typeof Mixin === 'function') {
    mixin = new Mixin();
  } else {
    mixin = Object.create(Mixin);
  }

  mixin.owner = owner;
  mixin.callFristWith = callFirstWith;
  mixin.getFirstWith = getFirstWith;

  return mixin;
};