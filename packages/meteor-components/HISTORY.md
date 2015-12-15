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