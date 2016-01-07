/*global Component, getFirstWith, callFirstWith, instantiateMixin*/
Component.on('initializing', function (component, template) {
  component.callFristWith = callFirstWith;
  component.getFirstWith = getFirstWith;

  if (typeof component.mixins === 'function') {
    let mixinInstances = component._mixinInstances = [];
    let mixins = component.mixins();

    mixins.forEach(function (m) {
      let mixin;

      if (typeof m === 'function') {
        mixin = m();
      } else {
        mixin = Object.create(m);
      }

      mixin.owner = component;
      mixin.callFristWith = callFirstWith;
      mixin.getFirstWith = getFirstWith;

      if (typeof mixin.initialize === 'function') mixin.initialize();

      if (typeof mixin.events === 'function') {
        template.events(Component.bindTo(mixin.events() || {}, mixin));
      }

      if (typeof mixin.helpers === 'function') {
        template.helpers(Component.bindTo(mixin.helpers() || {}, mixin));
      }

      mixinInstances.push(mixin);
    });
  }
});

Component.on('readying', function (component) {
  if (component._mixinInstances) {
    for (let mixin of component._mixinInstances) {
      if (typeof mixin.ready === 'function') {
        mixin.ready();
      }
    }
  }
});

Component.on('rerendering', function (component) {
  if (component._mixinInstances) {
    for (let mixin of component._mixinInstances) {
      if (typeof mixin.rerender === 'function') {
        mixin.rerender();
      }
    }
  }
});

Component.on('destroying', function (component) {
  if (component._mixinInstances) {
    let mixins = component._mixinInstances;
    while (mixins.length) {
      let mixin = mixins.pop();
      if (typeof mixin.destroy === 'function') {
        mixin.destroy();
      }
      mixin.owner = null;
    }
  }
});