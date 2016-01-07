/*global Component, ComponentUtil, Template, Blaze, Meteor*/
let callbacks = {};

Component = function (componentName, Ctor) {
  installComponent(componentName, Ctor);
};

Component.on = function (eventName, listener) {
  let listening = true;
  let listeners = callbacks[eventName];
  if (!listeners) listeners = callbacks[eventName] = [];

  listeners.push(listener);

  return {
    off() {
      if (listening) {
        listening = false;
        listeners.splice(listeners.indexOf(listener), 1);
      }
    }
  };
};

Component.trigger = function (eventName, ...args) {
  let listeners = callbacks[eventName];
  if (listeners) {
    for (let listener of listeners) {
      listener(...args);
    }
  }
};

Component.hookCreateComponent = function (componentName, Ctor, templateInstance) {
  let component = null;

  if (typeof Ctor === 'function') {
    component = new Ctor();
  } else if (typeof Ctor.create === 'function') {
    component = Ctor.create();
  } else {
    component = Object.create(Ctor);
  }

  if (component) {
    component.name = componentName;
    component.templateInstance = templateInstance;

    Component.trigger('initializing', component, templateInstance);

    if (typeof component.initialize === 'function') component.initialize();
  }

  return component;
};

// function (component, templateInstance)
Component.hookDestroyComponent = function (component, templateInstance) {
  // Call component#destroy() if it exists.
  if (typeof component.destroy === 'function') {
    component.destroy();
  }
};

function installComponent(componentName, Ctor) {
  let templateName = typeof Ctor.template === 'function' ?
    Ctor.template() : Ctor.template;
  templateName = templateName || componentName;
  let template = Template[templateName];

  if (!template) {
    throw new Error(`Template not found "${templateName}"`);
  }

  if (template.$component === true) {
    throw new Error(`Template "${templateName}" already bound to a component.`);
  }

  Component[componentName] = Ctor;
  // Mark the template as being in use by a component. This will prevent
  // other components from being installed with this template.
  template.$component = true;
  Template[componentName] = template;

  Component.trigger('installing', componentName, Ctor, template);

  // We depend on a very small set of Blaze APIs to get the job done.
  // We override the constructView() method so that we can copy the
  // template properties this way any modifications to the template won't affect
  // other templateInstances/views.
  let constructView = template.constructView;
  template.constructView = function (...args) {
    let componentTemplate = Object.create(template);
    // We have to copy the helpers, eventMaps and callbacks
    // properties otherwise we'll be setting helpers and listeners
    // up for all template instances.
    if (template.__helpers) {
      componentTemplate.__helpers = Object.create(template.__helpers);
    }
    if (template.__eventMaps) {
      componentTemplate.__eventMaps = template.__eventMaps.slice();
    }
    if (template._callbacks) {
      componentTemplate._callbacks = {
        created: template._callbacks.created.slice(),
        rendered: template._callbacks.rendered.slice(),
        destroyed: template._callbacks.destroyed.slice()
      };
    }

    componentTemplate.onCreated(function () {
      Component.trigger('creating', componentName, Ctor, this);

      let component = null;

      // Use the hookCreateComponent() if it exists.
      if (typeof Component.hookCreateComponent === 'function') {
        component = Component.hookCreateComponent(componentName, Ctor, this);
      } else {
        throw new Error('Component.hookCreateComponent must be a function.');
      }

      if (!component) {
        throw new Error(`Failed to create component ${componentName}`);
      }

      Component.trigger('initialized', component, this);

      this.component = component;

      // Setup the helpers. Helpers are easy to setup, we just need to
      // register them the same way as usual.
      if (typeof component.helpers === 'function') {
        let helpers = component.helpers();
        componentTemplate.helpers(ComponentUtil.bindTo(helpers, component));
      }

      // Setup the event listeners. Events are more tricky to setup, first
      // we need to listen to the private onViewRendered() event and then
      // need to ensure that only the events from the component are registered
      // when the view has been rendered and only on the first render.
      if (typeof component.events === 'function') {
        let firstRender = true;
        this.view._onViewRendered(() => {
          if (!firstRender) return;
          firstRender = false;

          // Copy the component template and ensure the eventMaps array
          // is empty. Then we get the component events, bind them to the component
          // and map them to the view.
          let scope = Object.create(componentTemplate);
          scope.__eventMaps = [];
          let events = this.component.events();
          scope.events(ComponentUtil.bindTo(events, this.component));

          for (let map of scope.__eventMaps) {
            Blaze._addEventMap(this.view, map, this.view);
          }
        });
      }

      Component.trigger('created', component, this);
    });

    componentTemplate.onRendered(function () {
      Component.trigger('readying', this.component, this);

      // Call component#ready() if it exists.
      if (typeof this.component.ready === 'function') {
        this.component.ready();
      }

      Component.trigger('readied', this.component, this);
    });

    componentTemplate.onDestroyed(function () {
      Component.trigger('destroying', this.component, this);

      if (typeof Component.hookDestroyComponent === 'function') {
        Component.hookDestroyComponent(this.component, this);
      } else {
        throw new Error('Component.hookDestroyComponent must be a function.');
      }

      Component.trigger('destroyed', this.component, this);

      this.component.templateInstance = null;
      this.component = null;
    });

    let view = constructView.call(componentTemplate, ...args);

    // If the component has a rerender() method then we hook into
    // the view's private onViewRendered() event.
    let firstRender = true;
    view._onViewRendered(function () {
      // Skip the first render.
      if (firstRender) {
        firstRender = false;
        return;
      }

      Component.trigger(
        'rerendering',
        view._templateInstance.component,
        view._templateInstance
      );

      if (view._templateInstance.component &&
        typeof view._templateInstance.component.rerender === 'function') {
        view._templateInstance.component.rerender();
      }

      Component.trigger(
        'rerendered',
        view._templateInstance.component,
        view._templateInstance
      );
    });

    return view;
  };

  Component.trigger('installed', componentName, Ctor, template);
}

// Enumerate the defined component types. For each component
// type we install it by calling Component() appropriately.
Meteor.startup(function () {
  for (let componentName in Component) {
    // Skip over properties that start with 'on', 'hook' or 'trigger'.
    if (!(ComponentUtil.startsWith(componentName, 'on') ||
      ComponentUtil.startsWith(componentName, 'hook') ||
      ComponentUtil.startsWith(componentName, 'trigger'))) {

      let Ctor = Component[componentName];
      Component(componentName, Ctor);
    }
  }
});