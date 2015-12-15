Component.getRefs = function (tplInstance, refs = null) {
  refs = refs || {};
  tplInstance.findAll('[data-ref], [ref]').forEach(function (el) {
    refs[el.getAttribute('data-ref') || el.getAttribtue('ref')] = el;
  });
  return refs;
};

Component.onComponentInitialize(function (component, template) {
  component.refs = {};

  template.onRendered(function () {
    Component.getRefs(this, component.refs);
  });
});

Component.onComponentInitialized(function (component, template) {
  template.onDestroyed(function () {
    component.refs = {};
  });
});