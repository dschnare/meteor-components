/*global Component*/
Component.onComponentInitializing(function (component, templateInstance) {
  component.parent = getNearestComponent(templateInstance.view);
  component.children = [];
  templateInstance.view.component = component;

  if (component.parent) {
    component.parent.children.push(component);
  }
});

Component.onComponentDestroyed(function (component, templateInstance) {
  component.parent = null;
  component.children = [];
  templateInstance.view.component = null;
});

function getNearestComponent(view) {
  while (view && !view.component) {
    view = view.originalParentView || view.parentView;
  }
  return view ? view.component : undefined;
}