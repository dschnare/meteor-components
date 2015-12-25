ComponentUtil.getRefs = function (tplInstance, refs = null) {
  refs = refs || {};
  tplInstance.findAll('[data-ref], [ref]').forEach(function (el) {
    refs[el.getAttribute('data-ref') || el.getAttribtue('ref')] = el;
  });
  return refs;
};

Component.onComponentInitializing(function (component) {
  component.refs = {};
});

Component.onComponentReadying(function (component, templateInstance) {
  ComponentUtil.getRefs(templateInstance, component.refs);
});

Component.onComponentDestroyed(function (component) {
  component.refs = {};
});