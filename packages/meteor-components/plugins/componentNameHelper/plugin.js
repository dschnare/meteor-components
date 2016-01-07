Component.on('installing', function (componentName, component, template) {
  template.helpers({
    componentName: () => component.name || componentName
  });
});