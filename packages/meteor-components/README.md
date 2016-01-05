# Overview

Meteor Components is a simple, lightweight component extension for Meteor
templates.


# Quick Start

Define your templates like usual.

    <template name="index">
      {{>Gravatar email="myemail@email.com"}}
    </template>

    <template name="Gravatar">
      <img src="{{gravatarUrl}}" />
    </template>

Now instead of defining your logic on `Template.Gravatar` define a component
of the same name as your template. Any `helpers` and `events` defined on the
`Template.Gravatar` template will still be available as usual, even globally
available `helpers` registered via `Template.registerHelper()`. Components
provide a convenient mechanism to define modular logic for your templates.

    // Show Gravatar avatar image.
    // See: https://secure.gravatar.com/site/implement/hash/
    Component.Gravatar = {
      helpers: function () {
        return {
          gravatarUrl: function () {
            // this.data() is a method call to retrieve
            // templateInstance.data, but if you specify a key path
            // the key path access will be reactive.
            var email = this.data('email');
            if (email) {
              email = email.replace(/^\s|\s$/g, '');
              var hash = CryptoJS.MD5(email);
              return "http://www.gravatar.com/avatar/" + hash;
            }
          }
        };
      }
    };


# Reference

## Component

Global used to hold component definitions.

**Example:**

    Component.MyComponent = class {
      /* component prototype methods */
    }

There are several ways to define a component.

**Constructor style**

    // ES6
    Component.MyComponent = class {
      constructor() {
        /* component instance properties */
      }

      /* component prototype methods */
    }

    // ES5/ES3
    Component.MyComponent = function {
      /* component instance properties */
    }
    /* component prototype properties */
    Component.MyComponent.prototype.instanceMethod = function () {};

**Object style**

    Component.MyComponent = {
      /* component instance properties */
    }

Object style components will be instantiated by calling `Object.create()`.
A polyfil is included so ES3 environments are still supported.

**Factory style**

    Component.MyComponent = {
      create: function () {
        return {
          /* compenent instance properties */
        };
      }
    }

### Component Lifecycle Methods

---

Each component can optionally define the following lifecycle methods.

## Component#initialize

    initialize()

Called after the component has been constructed/instantiated. This method is
used to initialize the state of the component.

**Example:**

    Component.MyComponent = class {
      initialize() {
        /* init state */
      }
    }

## Component#ready

    ready()

Called after the component has had its template rendered for the first time.
This method is used to initialize the DOM.

**Example:**

    Component.MyComponent = class {
      ready() {
        /* initialize the DOM */
      }
    }

## Component#rerender

    rerender()

Called each time the component's template is rerendered. This method is used to
initialize the DOM.

**Example:**

    Component.MyComponent = class {
      rerender() {
        /* initialize the DOM */
      }
    }

## Component#destroy

    destroy()

Called when a component's template has been destroyed without being rerendered.
When the template is destroyed so to is the component that backs it. This
method is used to release resource.

**Example:**

    Component.MyComponent = class {
      destroy() {
        /* release resource */
      }
    }


### Component API

---

## Component#templateInstance

    this.templateInstance

The `templateInstance` property holds a reference to the Meteor template
instance that this component backs. This property is only valid after the
component has been constructed.

**Example:**

    Component.MyComponent = class {
      constructor() {
        this.templateInstance // undefined
      }

      initialize() {
        this.templateInstance // valid instance
      }
    }

## Component#name

    this.name

The `name` property holds the name the component was defined with. This
property is only valid after the component has been constructed.

**Example:**

    Component.MyComponent = class {
      constructor() {
        this.name // undefined
      }

      initialize() {
        this.name // 'MyComponent'
      }
    }

## Component#parent

    this.parent

The `parent` property is a convenient way to walk up a component hierarchy.
This property refers to the nearest component parent. This property is only
valid after the component has been constructed.

**Example

    Component.App = class {}
    Componnet.MyComponent = class {
      constructor() {
        this.parent // undefined
      }

      initialize() {
        console.log(this.parent); // App instance
      }
    }

    <template name="App">
      {{> Template.contentBlock this}}
    </template>

    <template name="MyComponent">
      <p>{{componentName}}</p>
    </template>

    <body>
      {{#App}}
        {{> MyComponent}}
      {{/App}}
    </body>

## Component#children

    this.children

The `children` property is an array of child component references. These child
references are direct child components only. This property is only valid after
the component has been constructed.

**Example:**

    Component.App = class {
      constructor() {
        this.children // undefined
      }

      initialize() {
        this.children // [MyComponent instance]
      }
    }
    Componnet.MyComponent = class {}

    <template name="App">
      {{> Template.contentBlock this}}
    </template>

    <template name="MyComponent">
      <p>{{componentName}}</p>
    </template>

    <body>
      {{#App}}
        {{> MyComponent}}
      {{/App}}
    </body>

## Component#helpers

    helpers()

A method that defines a set of helpers to register on the template. Each helper
will be bound to the component so when invoked will behave more like methods of
the component.

**Example:**

    Component.MyComponent = class {
      helpers() {
        return {
          sayHi() {
            // 'this' is the component
            return this.sayHi();
          }
        }
      }

      sayHi() {
        return 'Hello World';
      }
    }

## Component#events

    events()

A method that defines a set of events to register on the template. Each event
will be bound to the component so when invoked will behave more like methods of
the component.

**Example:**

    Component.MyComponent = class {
      events() {
        return {
          'click': function (event) {
            // 'this' is the component
            this.sayHi();
          }
        }
      }

      sayHi() {
        return 'Hello World';
      }
    }


### Template Instance Wrappers

---

## Component#data

    data()
    data(keyPath)

Wrapper for accessing `templateInstance.data`. If a key path is specified
then the key path on the current data context will attempt to be retrieved. A
call with a key path is reactive. Behind the scenes the key path is passed to
[`ReactiveObj#get`](https://atmospherejs.com/xamfoo/reactive-obj).

See [template.data](http://docs.meteor.com/#/full/template_data).

## Component#currentData

    currentData()

Wrapper for accessing `Template.currentData()`.

See [Template.currentData](http://docs.meteor.com/#/full/template_currentdata).

## Component#findAll

    findAll(selector)

Wrapper for accessing `templateInstance.findAll()`.

See [template.findAll](http://docs.meteor.com/#/full/template_findAll).

## Component#$

    $(selector)

Wrapper for accessing `templateInstance.$()`.

See [template.$](http://docs.meteor.com/#/full/template_$).

## Component#find

    find(selector)

Wrapper for accessing `templateInstance.find()`.

See [template.find](http://docs.meteor.com/#/full/template_find).

## Component#firstNode

    firstNode()

Wrapper for accessing `templateInstance.firstNode`.

See [template.firstNode](http://docs.meteor.com/#/full/template_firstNode).

## Component#lastNode

    lastNode()

Wrapper for accessing `templateInstance.lastNode`.

See [template.lastNode](http://docs.meteor.com/#/full/template_lastNode).

## Component#autorun

    autorun(runFunc)

Wrapper for accessing `templateInstance.autorun()`.

See [template.autorun](http://docs.meteor.com/#/full/template_autorun).

## Component#subscribe

    subscribe(name, [arg1, arg2, ...], [options])

Wrapper for accessing `templateInstance.subscribe()`.

See [template.subscribe](http://docs.meteor.com/#/full/template_subscribe).

## Component#view

    view()

Wrapper for accessing `templateInstance.view`.

See [template.view](http://docs.meteor.com/#/full/template_view).


### Timeout Methods

---

## Component#setTimeout

    setTimeout(fn, [delay]): id

Convenient method to create a timeout that will automatically be cleared when
the component is destroyed.

## Component#clearTimeout

    clearTimeout(id)

Attempts to clear a timeout by ID. Can be an ID returned from the global
`setTimeout()`.

## Component#clearTimeouts

    clearTimeouts()

Clears all timeouts created by this compnent via `Component#setTimeout()`.

## Component#setInterval

    setInterval(fn, [delay]): id

Convenient method to create an interval that will automatically be cleared when
the component is destroyed.

## Component#clearInterval

    clearInterval(id)

Attempts to clear an interval by ID. Can be an ID returned from the global
`setInterval()`.

## Component#clearIntervals

    clearIntervals()

Clears all intervals created by this compnent via `Component#setInterval()`.


### DOM References

---

## Component#refs

As a convenience any element that has a `data-ref` or `ref` attribute set to
a name will be automatically selected and referenced on `refs`. However, since
this requires the DOM to be rendered, these references are only available after
the template has been rendered.

**Example:**

    Component.MyComponent = class {
      constructor() {
        this.refs // empty object
      }

      ready() {
        this.refs.block // <p> element
      }

      rerender() {
        this.refs.block // <p> element
      }
    }

    <template name="MyComponent">
      <div>
        <p data-ref="block">{{componentName}}</p>
      </div>
    </template>


### Mixins

---

To support modular architectures the concept of component mixins are supported.
A mixin is an object that bestows a component with a unique behaviour. Mixins
form a mixin chain, where each mixin may choose to delegate a method call to the
mixin further down the chain, and as such the order in which mixins are registered
is imporant.

## Compnent#mixins

    mixins()

Registers a chain of mixins for this component. Each mixin can be one of the
following.

- A constructor function.
- An object instance.
- An object or function with the method `create()`.

If a mixin is a constructor function then the mixin will be constructed with no
arguments (i.e. default constructor will be used).

If a mixin is an object instance then the mixin will be constructed via a call
to `Object.create()`.

If a mixin is an object with a `create()` method then the mixin will be
constructed by calling `create()` with no arguments.

**Example:**

    Component.MyComponent = class {
      mixins() {
        return [
          SomeConstructor,
          someObject,
          {
            create() {
              return {};
            }
          }
        ];
      }
    }

Each mixin will have an `owner` property set to the instance of the component
they have been applied to. This property won't be valid until after the
mixin has been constructed (i.e. during and after initialization).

**Mixin Lifecycle Methods**

Each mixin can optionally define the following lifecycle methods.

- initialize()
- ready()
- rerender()
- destroy()

Each method will be called just before the method of the same name is called
on the mixin's owning component.

**Mixin Hook Methods**

Each mixin can optionally define the following methods to hook into their
owning component's template instance.

- helpers()
- events()

These methods must return a hash of helpers or events respectively. Each event
or helper function will be bound to the mixin instance so they behave more like
methods of the mixin when invoked.

## Component#getFirstWith and Mixin#getFirstWith

    getFirstWith(origin, prop)

Attempts to retrieve the first mixin or component with the specified property.
If no property is defined anywhere int he chain then returns `undefined`.

If origin is `null` then lookup will start at the begining of the lookup chain;
the component. If origin is specified then lookup will start one after the
origin (i.e. if the component is passed as the origin then lookup starts at
the first mixin).

You can visualize the lookup chain as being an array that starts with the
component instance followed by all mixin instances.

    lookupChain = [component, mixin1, mixin2, ..., mixinN]

**Example:**

    Component.MyComponent = class {
      mixins() {
        return [
          {
            sayHello(...args) {
              console.log('Hello from mixin', ...args);
            }
          }
        ];
      }

      sayHello() {
        console.log('Hello from component');
      }

      ready() {
        // Get the first instance with 'sayHello'.
        // Since we passed null as the origin we start looking
        // from the component.
        let comp = this.getFirstWith(null, 'sayHello');
        // comp === this.
      }
    }


## Component#callFirstWith and Mixin#callFirstWith

    callFirstWith(origin, prop, [...args])

Attempts to call the first method defined on a mixin or component. If no
method is defined, but the property exists then returns the property's value.
If a method is defined then calls the method with the specified arguments and
returns the return value. If no property or method exists then returns
`undefined`.

If origin is `null` then lookup will start at the begining of the lookup chain;
the component. If origin is specified then lookup will start one after the
origin (i.e. if the component is passed as the origin then lookup starts at
the first mixin).

You can visualize the lookup chain as being an array that starts with the
component instance followed by all mixin instances.

    lookupChain = [component, mixin1, mixin2, ..., mixinN]

**Example:**

    Component.MyComponent = class {
      mixins() {
        return [
          {
            sayHello(...args) {
              console.log('Hello from mixin', ...args);
              // we choose not to delegate the call to the next mixin
            }
          }
        ];
      }

      sayHello() {
        console.log('Hello from component');
        // Call first 'sayHello' method defined by our next mixin.
        // Since we passed ourselves as the origin we start looking
        // from the first mixin (because the component starts the
        // lookup chain)
        this.callFirstWith(this, 'sayHello', 1, 2, 3);
      }

      ready() {
        // !! Execution starts here !!

        // Call the first 'sayHello' method defined by our mixins.
        // Since we passed null as the origin we start looking from
        // the component.
        this.callFirstWith(null, 'sayHello');
      }
    }


### Component Helpers

---

The following helpers are defined for each component for convenience.

## data

    data(keyPath)

Attempts to retrieve a key path from the current data context. This call is
reactive.

**Example:**

    {{data 'item.titm'}}

## componentName

    componentName()

Retrives the name of the component.

**Example:**

    {{componentName}}


# Plugin API

The plugin API allows plugin authors to modify components during specific
phases. Each phase can have callbacks registered before (ending in `'ing'`) and
after (ending in `'ed'`) the phase has taken place. The following phases are
supported.

- `onComponentInstalling/Installed`
- `onComponentCreating/Created`

**Post component creation**

- `onComponentInitialzing/Initialized`
- `onComponentReadying/Readied`
- `onComponentRerendering/Rerendered`
- `onComponentDestroying/Destroyed`

Each phase that occurs before or during component creation has the following
arguments passed in.

- Component name
- The component definition
- Template (i.e. Template.MyComponent)

**Example:**

    Component.onComponentInstalling(function (componentName, Ctor, template) {
      console.log('installing component:', componentName);
    });

Each phase that occurs after the component has been created has the following
arguments passed in.

- Component instance
- Template instance

**Example:**

    Component.onComponentInitializing(function (component, templateInstance) {
      console.log('initializing component:', component.name);
      component.myProp = 'some value';
    });

#### Hooks

In addition to the phases defined above a plugin can completely override how
a component is created and destroyed by overridding one or both of the
following hooks.

- `Component.hookCreateComponent(componentName, componentDef, templateInstance)`
- `Component.hookDestroyComponent(component, templateInstance)`

**Example:**

    let createComponent = Component.hookCreateComponent;
    Component.hookCreateComponent = function (name, def, templateInst) {
      console.log('creating component:', name);
      return createComponent(name, def, templateInst);
    };

    let destroyComponent = Component.hookDestroyComponent;
    Component.hookDestroyComponent = function (component, templateInst) {
      console.log('destroying component:', component.name);
      destroyComponent(component, templateInst);
    };

**Create Hook**

When overriding `hookCreateComponent()` you must take care of the following
responsibilities.

- Constructing/creating the component instance
- Setting the `name` and `templateInstance` properties
- Triggering `initializing` callbacks
- Calling `component.initialize()` if it exists
- Returning the component instance

To trigger registered callbacks use `Component.trigger(callbacksName, ...args)`.

**Example:**

    Component.hookCreateComponent = function (name, Ctor, templateInst) {
      // Do our own component creation.

      let component = null;

      if (typeof Ctor === 'function') {
        component = new Ctor();
      } else if (typeof Ctor.create === 'function') {
        component = Ctor.create();
      } else {
        component = Object.create(Ctor);
      }

      component.name = name;
      component.templateInstance = templateInst;

      Component.trigger('initializing', component, templateInst);

      if (typeof component.initialize === 'function') component.initialize();

      return component;
    };

**Destroy Hook**

When overriding `hookDestroyComponent()` you must take care of the following
responsibilities.

- Calling `component.destroy()` if it is defined

**Example:**

    Component.hookDestroyComponent = function (component) {
      console.log('destroying component:', component.name);
      if (typeof component.destroy === 'function') component.destroy();
    };