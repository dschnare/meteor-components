/*global Component, Template, ReactiveObj, EJSON*/
Component.onComponentInitializing(function (component, templateInstance) {
  // Provide convenience methods that mirrors the
  // template instance API.
  component.findAll = function (selector) {
    return templateInstance.findAll(selector);
  };
  component.$ = function (selector) {
    return templateInstance.$(selector);
  };
  component.find = function (selector) {
    return templateInstance.find(selector);
  };
  component.firstNode = function () {
    return templateInstance.firstNode;
  };
  component.lastNode = function () {
    return templateInstance.lastNode;
  };
  component.currentData = function () {
    return Template.currentData();
  };
  component.autorun = function (...args) {
    return templateInstance.autorun(...args);
  };
  component.subscribe = function (...args) {
    return templateInstance.subscribe(...args);
  };
  component.view = function () {
    return templateInstance.view;
  };

  initDataContext(component, templateInstance);
});

function initDataContext(component, templateInstance) {
  let dataContext = null;

  templateInstance.autorun(function (c) {
    let data = Template.currentData();

    if (c.firstRun) {
      dataContext = new ReactiveObj(data, {
        transform(value) {
          return EJSON.clone(value);
        }
      });
    } else {
      dataContext.set([], data);
    }
  });

  // Override the component's data() method to optionally accept
  // a path to retrieve from the data context. The path will be
  // reactive since it's being managed by a ReactiveObj instance.
  // If no path is specified then data() returns the non-reactive
  // data context as usual.
  component.data = function (path) {
    if (arguments.length === 0) {
      return templateInstance.data;
    }
    return dataContext ? dataContext.get(path) : null;
  };

  templateInstance.view.template.helpers({
    data(path) {
      return  dataContext ? dataContext.get(path) : null;
    }
  });
}