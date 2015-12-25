/*global Component*/
Component.onComponentInitializing(function (component) {
  component._timeouts = [];
  component.setTimeout = function (fn, duration) {
    let id = setTimeout(fn, duration);
    this._timeouts.push(id);
    return id;
  };
  component.clearTimeout = function (id) {
    clearTimeout(id);
    this._timeouts.splice(this._timeouts.indexOf(id), 1);
  };
  component.clearTimeouts = function () {
    while (this._timeouts.length) {
      clearTimeout(this._timeouts.pop());
    }
  };

  component._intervals = [];
  component.setInterval = function (fn, duration) {
    let id = setInterval(fn, duration);
    this._intervals.push(id);
    return id;
  };
  component.clearInterval = function (id) {
    clearInterval(id);
    this._intervals.splice(this._timeouts.indexOf(id), 1);
  };
  component.clearIntervals = function () {
    while (this._intervals.length) {
      clearInterval(this._intervals.pop());
    }
  };
});

Component.onComponentDestroying(function (component) {
  component.clearTimeouts();
  component.clearIntervals();
});