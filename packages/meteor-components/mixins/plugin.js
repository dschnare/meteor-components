/*global Component, getFirstWith, callFirstWith, instantiateMixin*/

// Install the mixins plugin.

Component.onComponentInitialize(function (component, template) {
  component.callFristWith = callFirstWith;
  component.getFirstWith = getFirstWith;

  if (typeof component.mixins === 'function') {
    let mixinInstances = component.mixins.$instances = [];
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
      let tplInst = this;

      mixins.forEach(function (mixin) {
        mixin.templateInstance = tplInst;
        if (mixin.onCreated) mixin.onCreated();
      });
    });

    template.onRendered(function () {
      let tplInst = this;
      let refs = Component.getRefs(tplInst);

      mixins.forEach(function (mixin) {
        mixin.refs = Object.create(refs);
        if (mixin.onRendered) mixin.onRendered();
      });
    });

    template.onDestroyed(function () {
      let mixinInstances = component.mixins.$instances;
      while (mixinInstances.length) {
        let mixin = mixinInstances.pop();
        if (mixin.onDestroyed) mixin.onDestroyed();
        mixin.owner = null;
        mixin.refs = null;
        mixin.templateInstance = null;
      }
    });
  }
});