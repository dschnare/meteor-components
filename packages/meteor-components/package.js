/*global Package*/
Package.describe({
  name: 'dschnare:meteor-components',
  version: '0.6.0',
  // Brief, one-line summary of the package.
  summary: 'Simple, lightweight component extension for Meteor templates.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/dschnare/meteor-components',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', 'client');
  api.use('templating', 'client');
  api.use('xamfoo:reactive-obj@0.5.0', 'client');
  api.use('ejson', 'client');

  api.addFiles([
    // polyfills
    'polyfills.js',
    // Core
    'util.js',
    'meteor-components.js',
    // Refs plugin
    'plugins/refs/plugin.js',
    // Hierarchy pugin
    'plugins/hierarchy/plugin.js',
    // Component name helper plugin
    'plugins/componentNameHelper/plugin.js',
    // Template instance methods plugin
    'plugins/templateInstanceMethods/plugin.js',
    // Timeout methods plugin
    'plugins/timeoutMethods/plugin.js',
    // Mixins plugin
    'plugins/mixins/getFirstWith.js',
    'plugins/mixins/callFirstWith.js',
    'plugins/mixins/plugin.js'
  ], 'client');

  api.export([
    'Component',
    'ComponentUtil'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('dschnare:meteor-components');
  api.addFiles('meteor-components-tests.js');
});
