ComponentUtil.getRefs = function (tplInstance, refs = null) {
  refs = refs || {};
  tplInstance.findAll('[data-ref], [ref]').forEach(function (el) {
    refs[el.getAttribute('data-ref') || el.getAttribtue('ref')] = el;
  });
  return refs;
};

Component.on('initializing', function (component) {
  component.refs = {};
});

Component.on('readying', function (component, templateInstance) {
  ComponentUtil.getRefs(templateInstance, component.refs);
});

Component.on('rerendering', function (component, templateInstance) {
  ComponentUtil.getRefs(templateInstance, component.refs);
});

Component.on('destroyed', function (component) {
  component.refs = {};
});