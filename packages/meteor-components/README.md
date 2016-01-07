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


# Component Definition

Components can be defined by setting properties on the `Component` global.
The follow describes the different styles a component can be defined.

**Constructor style**

    // ES6
    Component.MyComponent = class {
      constructor() {
        /* optional template name as a static method */
        static templateName() { return 'myTemplate'; }

        /* component instance properties */
      }

      /* component prototype methods */
    }

    // ES5/ES3
    Component.MyComponent = function {
      /* component instance properties */
    }
    /* optional template name as a static method */
    Component.MyComponent.templateName() { return 'myTemplate'; }
    /* optional template name as a static property */
    Component.MyComponent.templateName = 'myTemplate';

    /* component prototype properties */
    Component.MyComponent.prototype.method = function () {};

**Object style**

    Component.MyComponent = {
      /* optional template name as a method */
      templateName() { return 'myTemplate'; }
      /* optional template name as a property */
      templateName: 'myTemplate';

      /* component instance properties */
    }

Object style components will be instantiated by calling `Object.create()`.
A polyfil is included so ES3 environments are still supported.

**Factory style**

    Component('MyComponent', function () {
      return {
        /* component instance properties */
      };
    }, 'templateName')

The template name is optional and will default to the component name if not
specified.

All other component definition styles are actually built on top of the factory
style. After `Meteor` has started up, the component system enumerates all
component definition properties on `Component` and appropriately wraps them in
a factory function that is passed to `Component()`.


# Component Extension

No matter how a component was defined it can be consistently extended in a
sensical fashion based on the new component defintion style.

**Constructor style**

    // ES6
    Component.MyComponentXX = class extends Component.BaseComponent {
      constructor() {
        super()
      }
    }

    // ES3/5
    Component.MyComponentXX = function () {
      Component.BaseComponent.call(this);
    }
    Component.MyComponentXX = Object.create(Component.BaseComponent.prototype)

**Object style**

    Component.MyComponentXX = Object.assign(Object.create(Component.BaseComponent()), {
      /* component instance properties */
    })

**Factory style**

    Component('MyComponentXX', function () {
      return Object.assign(Object.create(Component.BaseComponent()), {
        /* component instance properties */
      })
    })

**Constructor mascarade**

As a convenience when components are defined as a constructor/class the
constructor-like behaviour is mascaraded onto the factor function so that
the factory function can be extended like a constructor/class (as seen above),
and also accept arguments that will be passed to the constructor.

By default the component system will not pass any arguments to the factory
functions, but this feature may make it easier to pass in dependencies to
base components (i.e. components meant to be extended) or by a plugin that
overrides `Component.hookCreateComponent()`.

**Example:**

    Component.SomeComponent = class {
      constructor(a) {
        if (a) {
          /* do something special with a */
        }
      }
    }

    Component.SubComponent = class extends Component.SomeComponent {
      super({ name: 'this is a' });
    }

**Getting access to the original definition**

Sometimes it's beneficial to know how a component was defined. To find
out what the original component definition was before it was wrapped in a
factory function inpsect the `$definition` property on the factory function.

It's important to note that changing the value of the `$definition` property
will not have any affect on the output of the factory function. However,
all in-place modifications will be reflected in the factory function result.

**Example:**

    // All three components are defined differently

    Component.ComponentA = {}
    Component('B', function () {})
    Component.ComponentC = class {}

    // After Meteor stats up the component system picks up
    // ComponentA and ComponentC and wraps them in a factory function
    // to pass to Component() and sets a $definition property on the
    // factory function.

    Component.ComponentA.$definition // original object
    Component.ComponentB.$definition // undefined (since defined as a factory)
    Component.ComponentC.$definition // origin constructor



# Reference

### Component Lifecycle Methods

---

Each component can optionally define the following lifecycle methods.

## component.initialize

    initialize()

Called after the component has been constructed/instantiated. This method is
used to initialize the state of the component.

**Example:**

    Component.MyComponent = class {
      initialize() {
        /* init state */
      }
    }

## component.ready

    ready()

Called after the component has had its template rendered for the first time.
This method is used to initialize the DOM.

**Example:**

    Component.MyComponent = class {
      ready() {
        /* initialize the DOM */
      }
    }

## component.rerender

    rerender()

Called each time the component's template is rerendered. This method is used to
initialize the DOM.

**Example:**

    Component.MyComponent = class {
      rerender() {
        /* initialize the DOM */
      }
    }

## component.destroy

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

## component.templateInstance

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

## component.name

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

## component.parent

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

## component.children

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

## component.helpers

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

## component.events

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

## component.data

    data()
    data(keyPath)

Wrapper for accessing `templateInstance.data`. If a key path is specified
then the key path on the current data context will attempt to be retrieved. A
call with a key path is reactive. Behind the scenes the key path is passed to
[`ReactiveObj#get`](https://atmospherejs.com/xamfoo/reactive-obj).

See [template.data](http://docs.meteor.com/#/full/template_data).

## component.currentData

    currentData()

Wrapper for accessing `Template.currentData()`.

See [Template.currentData](http://docs.meteor.com/#/full/template_currentdata).

## component.findAll

    findAll(selector)

Wrapper for accessing `templateInstance.findAll()`.

See [template.findAll](http://docs.meteor.com/#/full/template_findAll).

## component.$

    $(selector)

Wrapper for accessing `templateInstance.$()`.

See [template.$](http://docs.meteor.com/#/full/template_$).

## component.find

    find(selector)

Wrapper for accessing `templateInstance.find()`.

See [template.find](http://docs.meteor.com/#/full/template_find).

## component.firstNode

    firstNode()

Wrapper for accessing `templateInstance.firstNode`.

See [template.firstNode](http://docs.meteor.com/#/full/template_firstNode).

## component.lastNode

    lastNode()

Wrapper for accessing `templateInstance.lastNode`.

See [template.lastNode](http://docs.meteor.com/#/full/template_lastNode).

## component.autorun

    autorun(runFunc)

Wrapper for accessing `templateInstance.autorun()`.

See [template.autorun](http://docs.meteor.com/#/full/template_autorun).

## component.subscribe

    subscribe(name, [arg1, arg2, ...], [options])

Wrapper for accessing `templateInstance.subscribe()`.

See [template.subscribe](http://docs.meteor.com/#/full/template_subscribe).

## component.view

    view()

Wrapper for accessing `templateInstance.view`.

See [template.view](http://docs.meteor.com/#/full/template_view).


### Timeout Methods

---

## component.setTimeout

    setTimeout(fn, [delay]): id

Convenient method to create a timeout that will automatically be cleared when
the component is destroyed.

## component.clearTimeout

    clearTimeout(id)

Attempts to clear a timeout by ID. Can be an ID returned from the global
`setTimeout()`.

## component.clearTimeouts

    clearTimeouts()

Clears all timeouts created by this compnent via `component.setTimeout()`.

## component.setInterval

    setInterval(fn, [delay]): id

Convenient method to create an interval that will automatically be cleared when
the component is destroyed.

## component.clearInterval

    clearInterval(id)

Attempts to clear an interval by ID. Can be an ID returned from the global
`setInterval()`.

## component.clearIntervals

    clearIntervals()

Clears all intervals created by this compnent via `component.setInterval()`.


### DOM References

---

## component.refs

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

## component.mixins

    mixins()

Registers a chain of mixins for this component. Each mixin can be one of the
following.

- A factory function.
- An object instance.

If a mixin is an object instance then the mixin will be constructed via a call
to `Object.create()`.

**Example:**

    Component.MyComponent = class {
      mixins() {
        return [
          someObject,
          function () {
            return {};
          },
          function () {
            return new MyMixin();
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

## component.getFirstWith and mixin.getFirstWith

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


## component.callFirstWith and mixin.callFirstWith

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
phases. Each phase can have listeners registered before (ending in `'ing'`) and
after (ending in `'ed'`) the phase has taken place. The following phases are
supported.

- `installing/installed`
- `creating/created`

**Post component creation**

- `initialzing/initialized`
- `readying/readied`
- `rerendering/rerendered`
- `destroying/destroyed`

Each phase that occurs before or during component creation has the following
arguments passed in.

- Component name
- The component definition
- Template (i.e. Template.MyComponent)

**Example:**

    Component.on('installing', function (componentName, factory, template) {
      console.log('installing component:', componentName);
    });

Each phase that occurs after the component has been created has the following
arguments passed in.

- Component instance
- Template instance

**Example:**

    Component.on('initializing', function (component, templateInstance) {
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

- Creating the component instance by calling the factory function
- Setting the `name` and `templateInstance` properties
- Triggering `initializing` event
- Calling `component.initialize()` if it exists
- Returning the component instance

To trigger an event use `Component.trigger(eventName, ...args)`.

**Example:**

    Component.hookCreateComponent = function (name, factory, templateInst) {
      // Do our own component creation.
      let component = factory();

      component.name = name;
      component.templateInstance = templateInst;

      Component.trigger('initializing', component, templateInst);

      if (typeof component.initialize === 'function') component.initialize();

      return component;
    };


    // Or more simply
    let hookCreateComponent = Component.hookCreateComponent;
    Component.hookCreateComponent = function (name, factory, templateInst) {
      return hookCreateComponent(name, function () {
        let component = factory();

        console.log('creating component:', name);

        return component;
      }, templateInst);
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