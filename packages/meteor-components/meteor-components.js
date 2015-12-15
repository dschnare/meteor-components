/*global Component, createComponentView, componentRegistry,
Template, Blaze, Meteor*/
let callbacks = {};
callbacks.componentInitialize = [];
callbacks.componentInitialized = [];

Component = function (componentName, Ctor) {
  let templateName = typeof Ctor.template === 'function' ?
    (Ctor.template() || componentName) : (Ctor.template || componentName);
  let template = Template[templateName];

  if (template) {
    let init = initComponentTemplate.bind(void 0, Ctor, componentName);
    // We override the template and we also set the template under the
    // component's name so that way you can use either the template name
    // or the component's name in your views. This is only useful if your
    // component name and template names are different.
    Template[templateName]
      = Template[componentName]
      = extendTemplate(template, init);
  } else {
    throw new Error('Template not found: ' + templateName);
  }
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

function initComponentTemplate(Ctor, componentName, template) {
  let component = instantiateComponent(Ctor, componentName);

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
    if (component.onCreated) component.onCreated();
  });

  template.onRendered(function () {
    if (component.onRendered) component.onRendered();
  });

  template.onDestroyed(function () {
    if (component.onDestroyed) component.onDestroyed();
  });

  callbacks.componentInitialized.forEach(function (callback) {
    callback(component, template);
  });
}

// Extend a Blaze.Template by creating a new template that has a
// render function that will return a copy of the template passed in.
// The init() function will be called with the template copy.
function extendTemplate(template, init) {
  // We depend on a very small set of Blaze APIs to get the job done.
  // We override the constructView() method so that we can copy the
  // template and modify it before it is passed off to the view.
  let constructView = template.constructView;
  template.constructView = function (...args) {
    let copy = Object.create(template);
    // We have to copy the helpers, eventMaps and callbacks
    // properties otherwise we'll be setting helpers and listeners
    // up for all template instances.
    if (copy.__helpers) {
      copy.__helpers = Object.create(copy.__helpers);
    }
    if (copy.__eventMaps) {
      copy.__eventMaps = copy.__eventMaps.slice();
    }
    if (copy._callbacks) {
      copy._callbacks = {
        created: template._callbacks.created.slice(),
        rendered: template._callbacks.rendered.slice(),
        destroyed: template._callbacks.destroyed.slice()
      };
    }
    init(copy);
    return constructView.call(copy, ...args);
  };
  return template;
}

function instantiateComponent(CtorOrObject, componentName) {
  let component;

  if (typeof CtorOrObject === 'function') {
    component = new CtorOrObject();
  } else {
    component = Object.create(CtorOrObject);
  }

  component.name = componentName;
  return component;
}

// Enumerate the defined component types. For each component
// type we define it by calling Component() appropriately.
Meteor.startup(function () {
  for (let componentName in Component) {
    // All components are expected to have a upper camel case naming
    // convention.
    if (componentName.charAt(0) ===
      componentName.charAt(0).toUpperCase()) {
      let Ctor = Component[componentName];
      Component(componentName, Ctor);
    }
  }
});