let hierarchy = [];
hierarchy.peek = function () { return this[this.length - 1]; };

Component.onComponentInitialize(function (component, template) {
  component.parent = hierarchy.peek();
  component.children = [];

  if (component.parent) {
    component.parent.children.push(component);
  }

  template.onCreated(function () {
    hierarchy.push(component);
  });

  template.onRendered(function () {
    hierarchy.pop();
  });
});

Component.onComponentInitialized(function (component, template) {
  template.onDestroyed(function () {
    component.parent = null;
    component.children = [];
  });
});