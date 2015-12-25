/*global Component, Template*/
Component.onComponentInitializing(function (component) {
  // Provide convenience methods that mirrors the
  // template instance API.
  component.findAll = function (selector) {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.findAll(selector);
  };
  component.$ = function (selector) {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.$(selector);
  };
  component.find = function (selector) {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.find(selector);
  };
  component.firstNode = function () {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.firstNode;
  };
  component.lastNode = function () {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.lastNode;
  };
  component.data = function () {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.data;
  };
  component.currentData = function () {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return Template.currentData();
  };
  component.autorun = function (...args) {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.autorun(...args);
  };
  component.subscribe = function (...args) {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.subscribe(...args);
  };
  component.view = function () {
    if (!this.templateInstance)
      throw new Error('Component template hasn\'t been created.');
    return this.templateInstance.view;
  };
});