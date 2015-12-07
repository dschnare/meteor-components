/*global Component, createComponentView, componentRegistry,
Template, Blaze, Meteor*/
let hierarchy = [];
hierarchy.peek = function () { return this[this.length - 1]; };

let callbacks = {};
callbacks.componentInitialize = [];
callbacks.componentInitialized = [];

Component = function (componentName, Ctor) {
  let component = instantiateComponent(Ctor, hierarchy.peek());
  let templateName = typeof component.template === 'function' ?
    component.template() || componentName : componentName;
  let template = Template[templateName];

  if (template) {
    let init = initComponentTemplate.bind(void 0, component);
    Template[templateName] = extendTemplate(template, init);
  } else {
    throw new Error('Template not found: ' + templateName);
  }
};

Component.getRefs = function (tplInstance, refs = null) {
  refs = refs || {};
  tplInstance.findAll('[data-ref], [ref]').forEach(function (el) {
    refs[el.getAttribute('data-ref') || el.getAttribtue('ref')] = el;
  });
  return refs;
};

// Wraps all functions in the funcMap by binding them
// to the thisObj. Returns a new object with the bound
// functions.
Component.bindTo = function (funcMap, thisObj) {
  let o = {};
  for (let k in funcMap) {
    if (typeof funcMap[k] === 'function') {
      o[k] = funcMap[k].bind(thisObj);
    }
  }
  return o;
};

Component.onComponentInitialize = function (callback) {
  callbacks.componentInitialize.push(callback);
};

Component.onComponentInitialized = function (callback) {
  callbacks.componentInitialized.push(callback);
};

function initComponentTemplate(component, template) {
  callbacks.componentInitialize.forEach(function (callback) {
    callback(component, template);
  });

  if (typeof component.init === 'function') component.init();

  if (typeof component.events === 'function') {
    template.events(Component.bindTo(component.events() || {}, component));
  }

  if (typeof component.helpers === 'function') {
    template.helpers(Component.bindTo(component.helpers() || {}, component));
  }

  template.onCreated(function () {
    hierarchy.push(component);

    component.templateInstance = this;
    if (component.onCreated) component.onCreated();
  });

  template.onRendered(function () {
    hierarchy.pop();

    Component.getRefs(this, component.refs);

    if (component.onRendered) component.onRendered();
  });

  template.onDestroyed(function () {
    if (component.onDestroyed) component.onDestroyed();
    component.templateInstance = null;
    component.parent = null;
    component.refs = null;
    component.children = [];
  });

  callbacks.componentInitialized.forEach(function (callback) {
    callback(component, template);
  });
}

// Extend a Blaze.Template by creating a new template that has a
// render function that will return a copy of the template passed in.
// The init() function will be called with the template copy.
function extendTemplate(template, init) {
  return new Blaze.Template('(component)', function () {
    let copy = new Blaze.Template(template.viewName, template.renderFunction);
    // Copy over the state so that if events, helpers or callbacks are defined
    // via the Template.MyTemplate API then they are used in each component
    // template. This effectively makes the template the "prototype" for the
    // component template.
    // NOTE: If the Blaze.Template code changes then this will need to
    // be updated, but it's only in this spot. If this turns out to be a problem
    // then we'll drop support for it.
    if (template.__eventMaps) {
      copy.__eventMaps = template.__eventMaps.slice();
    }
    if (template.__helpers) {
      copy.__helpers = Object.create(template.__helpers);
    }
    if (template._callbacks) {
      copy._callbacks = {
        created: template._callbacks.created.slice(),
        rendered: template._callbacks.rendered.slice(),
        destroyed: template._callbacks.destroyed.slice()
      };
    }
    init(copy);
    return copy;
  });
}

function instantiateComponent(CtorOrObject, parent) {
  let component;

  if (typeof CtorOrObject === 'function') {
    component = new CtorOrObject();
  } else {
    component = Object.create(CtorOrObject);
  }

  component.parent = parent;
  component.children = [];
  component.refs = {};

  if (component.parent) {
    component.parent.children.push(component);
  }

  return component;
}

// Method names on Component that we need to skip over
// when we are enumerating the defined component types.
let methodNames = [
  'onComponentInitialize',
  'onComponentInitialized',
  'bindTo',
  'getRefs'
];

// Enumerate the defined component types. For each component
// type we define it by calling Component() appropriately.
if (Meteor.isClient) {
  Meteor.startup(function () {
    for (let componentName in Component) {
      let Ctor = Component[componentName];

      // Skip methods on Component.
      if (methodNames.indexOf(componentName) >= 0) continue;

      Component(componentName, Ctor);
    }
  });
}