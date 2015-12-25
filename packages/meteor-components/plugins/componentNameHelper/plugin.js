Component.onComponentInstalling(function (componentName, component, template) {
  template.helpers({
    componentName: () => component.name || componentName
  });
});