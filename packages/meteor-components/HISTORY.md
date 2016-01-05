# 0.6.4

**Jan. 4, 2016**

- Write reference documentation.


# 0.6.3

**Jan. 4, 2016**

- Add support for mixins to have a static `create()` method for mixin
  factorized mixin creation.

- Hook into `rerendering` callback phase to call `rerender()` method on mixin
  instances.


# 0.6.2

**Jan. 4, 2016**

- Hook into `rerendering` callback phase to reset the referenced DOM nodes
  set on `refs`.



# 0.6.1

**Jan. 4, 2016**

- Add support for `rerendering` and `rerendered` callbacks phases by
  implementing `onComponentRerendering()` and `onComponentRerendered()`.

- Move component creation into default implementation of
  `hookCreateComponent()`.

- Move component destruction into default implementation of
  `hookDestroyComponent()`.


# 0.6.0

**Jan. 4, 2016**

- Override the `data()` method to accept a key path. When calling this method
  with a key path the request the request is reactive.

- Add a `data(path)` helper to all components automatically that provides a
  convenient helper to retrieve keys from the data context in a reactive
  fashion. This allows individual data context paths to be reactive instead of
  the entire data context.

- Add support for creating a component via factory function by looking for a
  static `create()` method on the object defining the component.



# 0.5.1

**Jan. 1, 2016**

- Fix issue with component temlpate being re-used for each instance of
  the component. This is a problem because each component has their own
  helpers and events that when registered modify the template.


# 0.5.0

**Dec. 29, 2015**

- Add `hookDestroyComponent` to provide a hook to destroy a component.
  This hook is responsible for destroying a component and must call
  the component's `destroy` method.

- Change `hookCreateComponent` so that it is now responsible for triggering
  `onComponentInitializing` and calling the component's `initialize` method.
  This hook is also responsible for setting the `name` and `templateInstance`
  properties on the component before the component's `initialize` method is
  called.

- Add `trigger` method to `Component`.


# 0.4.0

**Dec. 25, 2015**

- Refactor startup logic so that components with any naming convention are
  recognized not just components that use a upper camel case naming convention.

- Refactor plugin system to include the following callbacks:
  `onComponentInstalling/Installed`, `onComponentCreating/Created`,
  `onComponentInitializing/Initialized`, `onComponentReadying/Readied`,
  `onComponentDestroying/Destroyed`.

- Add `hookCreateComponent()` to provide plugins the opportunity to override
  how components are created. Only one plugin can provide this hook.

- Rename component lifecycle methods; `onCreated` to `initialize`, `onRendered`
  to `ready` and `onDestroyed` to `destroy`.

- Refactor component lifecycle so that components are constructed when the
  template is first created so that the construction *is* the `onCreated`
  handler. Optionally support `initialize` to allow separating dependency
  setup from state initialization. These changes were made so that plugins
  can take full control over component construction and dependency management.

- Refactor hierarchy plugin to support arbitrary view hierarchies so that
  parent-child relationships won't be broken when a new view is inserted
  say from a new list item.

- Break out utilitarian functions into their own namespace `ComponentUtil`.


# 0.3.1

**Dec. 15, 2015**

- Remove `refs`, `children` and `templateInstance` as properties from mixins.
- Update comments and docs.
- Save component constructor or object on `Component` to support calling `Component()` directly instead of defining a component as a property on `Component`.

# 0.3.0

**Dec. 14, 2015**

- Refactor all features outside of core as a plugin.
- Implement a plugin to expose a similar API on the component as that is available on a template instance.
- Implement a plugin to expose timeout functions that will automtacially be cleared on the component is disposed.
- Implement a plugin to expose a refs object that holds a reference to each element with a `data-ref` or `ref` attribute.
- Implement a plugin to expose a helper to render the component name.
- Implement a plugin to manage and initialize the component hierarchy properties on a component.
- Refactor how templates are extended; override constructView() instead of creating a nested template. This keeps the data context available throughout the hierarhcy.
- Implement polyfils for `Object.create`, `Array.prototype.indexOf`, `Array.prototype.forEach` and `Function.prototype.bind`.
- Require components defined on `Component` to use upper camel case naming convention. This means lower camel case components will be skipped. This implies that any other properties on `Component` will be skipped. If this is a problem users can still use `Component(name, Ctor)` as a function.

# 0.2.0

**Dec. 8, 2015**

- Refactor `template()` method so that it is expected to be statically available on the component constructor or object.
- Add support for `template` static property that specifies the template to override.

# 0.1.3

**Dec. 7, 2015**

- Add the `name` property to each component instance after they are created.
- Add `componentName` helper for each component for conveintly accessing the name of the component.

# 0.1.2

**Dec. 7, 2015**

- Add support for `template()` method on component instances so they can specify the template to override.

# 0.1.1

**Dec. 7, 2015**

- Save mixin instances on `_mixinInstances` component instance property instead of on the `mixins` component instance method.

# 0.1.0

**Dec. 6, 2015**

- Set `templateInstance` instead of passing the template instance as a parameter to onCreated, onRendered and onDestoryed.
- Test the example in the README.md.
- Simulate the same component API in mixins so that components can be used as mixins interchangably.
- Add `if` blocks around `__eventMaps`, `__helpers` and `_callbacks` extensions so that if MDG changes things our Meteor Components will still work.