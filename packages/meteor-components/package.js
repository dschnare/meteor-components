Package.describe({
  name: 'dschnare:meteor-components',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('templating');

  api.addFiles([
    // Core
    'meteor-components.js',
    // Mixin feature
    'mixins/getFirstWith.js',
    'mixins/callFirstWith.js',
    'mixins/instantiateMixin.js',
    'mixins/plugin.js'
  ], 'client');

  api.export('Component', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('dschnare:meteor-components');
  api.addFiles('meteor-components-tests.js');
});
