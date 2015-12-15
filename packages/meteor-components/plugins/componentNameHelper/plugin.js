Component.onComponentInitialized(function (component, template) {
  template.helpers({
    componentName: function () { return component.name; }
  });
});