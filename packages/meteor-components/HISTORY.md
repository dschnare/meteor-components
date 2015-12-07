# Dec. 6, 2015

- Set `templateInstance` instead of passing the template instance as a parameter to onCreated, onRendered and onDestoryed.
- Test the example in the README.md.
- Simulate the same component API in mixins so that components can be used as mixins interchangably.
- Add `if` blocks around `__eventMaps`, `__helpers` and `_callbacks` extensions so that if MDG changes things our Meteor Components will still work.