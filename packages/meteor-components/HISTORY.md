# 0.1.1

**Dec. 6, 2015**

- Save mixin instances on `_mixinInstances` component instance property instead of on the `mixins` component instance method.

# 0.1.0

**Dec. 6, 2015**

- Set `templateInstance` instead of passing the template instance as a parameter to onCreated, onRendered and onDestoryed.
- Test the example in the README.md.
- Simulate the same component API in mixins so that components can be used as mixins interchangably.
- Add `if` blocks around `__eventMaps`, `__helpers` and `_callbacks` extensions so that if MDG changes things our Meteor Components will still work.