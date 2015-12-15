/*global Component, getFirstWith, callFirstWith, instantiateMixin*/
Component.onComponentInitialize(function (component, template) {
  component.callFristWith = callFirstWith;
  component.getFirstWith = getFirstWith;

  if (typeof component.mixins === 'function') {
    let mixinInstances = component._mixinInstances = [];
    let mixins = component.mixins();

    mixins.forEach(function (Mixin) {
      let mixin = instantiateMixin(Mixin, component);
      if (typeof mixin.init === 'function') mixin.init();

      if (typeof mixin.events === 'function') {
        template.events(Component.bindTo(mixin.events() || {}, mixin));
      }

      if (typeof mixin.helpers === 'function') {
        template.helpers(Component.bindTo(mixin.helpers() || {}, mixin));
      }

      mixinInstances.push(mixin);
    });

    template.onCreated(function () {
      mixins.forEach(function (mixin) {
        if (mixin.onCreated) mixin.onCreated();
      });
    });

    template.onRendered(function () {
      mixins.forEach(function (mixin) {
        if (mixin.onRendered) mixin.onRendered();
      });
    });

    template.onDestroyed(function () {
      let mixinInstances = component._mixinInstances;
      while (mixinInstances.length) {
        let mixin = mixinInstances.pop();
        if (mixin.onDestroyed) mixin.onDestroyed();
        mixin.owner = null;
      }
    });
  }
});