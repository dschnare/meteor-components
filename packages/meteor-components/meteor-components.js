/*global Component, ComponentUtil, Template, Blaze, Meteor*/
let callbacks = {};

Component = function (componentName, factory, templateName) {
  installComponent(componentName, factory, templateName || componentName);
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

Component.hookCreateComponent = function (componentName, factory, templateInstance) {
  let component = factory();

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

function installComponent(componentName, factory, templateName) {
  let template = Template[templateName];

  if (!template) {
    throw new Error(`Template not found "${templateName}"`);
  }

  // Components can re-use template that have been used by other components.
  // Here we check to see if the component name and template name are different
  // and if they are then we clone the template and assign it to the compnonent
  // name. This way we only clone the template when we absolutely need to.
  if (templateName !== componentName) {
    template = cloneTemplate(template);
    Template[componentName] = template;
  }

  Component[componentName] = factory;

  Component.trigger('installing', componentName, factory, template);

  // We depend on a very small set of Blaze APIs to get the job done.
  // We override the constructView() method so that we can copy the
  // template properties this way any modifications to the template won't affect
  // other templateInstances/views.
  let constructView = Template.prototype.constructView;
  template.constructView = function (...args) {
    // We have to copy the template because our component adds its own
    // helpers and events when the template is instantiated.
    let componentTemplate = cloneTemplate(template);

    componentTemplate.onCreated(function () {
      Component.trigger('creating', componentName, factory, this);

      let component = null;

      // Use the hookCreateComponent() if it exists.
      if (typeof Component.hookCreateComponent === 'function') {
        component = Component.hookCreateComponent(componentName, factory, this);
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

  Component.trigger('installed', componentName, factory, template);
}

function cloneTemplate(template) {
  let tpl = Object.create(template);

  if (template.__helpers) {
    tpl.__helpers = Object.create(template.__helpers);
  }
  if (template.__eventMaps) {
    tpl.__eventMaps = template.__eventMaps.slice();
  }
  if (template._callbacks) {
    tpl._callbacks = {
      created: template._callbacks.created.slice(),
      rendered: template._callbacks.rendered.slice(),
      destroyed: template._callbacks.destroyed.slice()
    };
  }

  return tpl;
}

// Enumerate the defined component types. For each component
// type we install it by calling Component() appropriately.
Meteor.startup(function () {
  for (let componentName in Component) {
    // Skip over properties that start with 'on', 'hook' or 'trigger'.
    if (!(ComponentUtil.startsWith(componentName, 'on') ||
      ComponentUtil.startsWith(componentName, 'hook') ||
      ComponentUtil.startsWith(componentName, 'trigger'))) {

      let def = Component[componentName];
      let templateName = def && typeof def.template === 'function' ?
        def.template() : !!def && def.template;

      if (typeof def === 'function') {
        let Ctor = def;
        let factory = function (...args) {
          if (this instanceof Ctor) {
            return Ctor.apply(this, args);
          } else {
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4],
                  args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4],
                  args[5], args[6]);
              case 8:
                return new Ctor(args[0], args[1], args[2], args[3], args[4],
                  args[5], args[6], args[7]);
              case 9:
                return new Ctor(args[0], args[1], args[2], args[3], args[4],
                  args[5], args[6], args[7], args[8]);
              case 10:
                return new Ctor(args[0], args[1], args[2], args[3], args[4],
                  args[5], args[6], args[7], args[8], args[9]);
              default:
                throw new Error('Too many arguments for component constructor.');
            }
          }
        };
        factory.prototype = Ctor.prototype;
        factory.$definition = def;
        Component(componentName, factory, templateName);
      } else if (def && typeof def === 'object' && !Array.isArray(def)) {
        let factory = function () {
          return Object.create(def);
        };
        factory.$definition = def;
        Component(componentName, factory, templateName);
      } else {
        throw new Error(`Unrecognized component definition. [${componentName}]`);
      }
    }
  }
});