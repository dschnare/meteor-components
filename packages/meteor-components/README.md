# Meteor Components

Meteor Components is a simple, lightweight component
extension for Meteor templates.

## Quickstart

    <template name="index">
      {{>Gravatar email="myemail@email.com"}}
    </template>

    <template name="Gravatar">
      <img src="{{gravatarUrl}}" />
    </template>

    // Show Gravatar avatar image.
    // See: https://secure.gravatar.com/site/implement/hash/
    // For a more in-depth look at the component API
    // see https://github.com/dschnare/meteor-components/blob/master/client/index.js.
    Component.Gravatar = {
      helpers: function () {
        return {
          gravatarUrl: function () {
            var email = this.templateInstance.data().email;
            if (email) {
              email = email.replace(/^\s|\s$/g, '');
              var hash = CryptoJS.MD5(email);
              return "http://www.gravatar.com/avatar/" + hash;
            }
          }
        };
      }
    };

## Why

Why implement a package like this when Blaze Components
exists that already does something similar?

- Blaze Components does too many things for a single
  package. Blaze Components introduces "namespaced"
  templates in addition to the component framework.

- Creating a Blaze Component doesn't feel like the Meteor
  way. Meteor Components tries to follow established
  Meteor idioms so if you know templates, you know
  components.

- Blaze Components overrides low-level, private methods
  deep in the Blaze templating layer. This exposes your
  code to a high degree of lock-in since a change in Meteor
  has a high likelihood of impacting Blaze Components so
  you won't be able to update Blaze Components without
  the risk of having conflicts with your version of Meteor.

- Blaze Components lacks a robust child-parent linking
  mechanism that detects child-parent relationships
  outside a template definition. Meteor Components resovles
  child-parent relationships when the components are first
  created so the child-parent relationships are always
  available to you.

## Thank You

I'd like to thank the Blaze Components authors for providing
a great framework and paving the way. Without Blaze Components
as an example, Meteor Components would not be the way it is today.

But if you're looking for a similar Blaze Components framework
with a smaller footprint and doesn't inject istself deep into
the Blaze API then try Meteor Components.

## Difference With Blaze Components

- Only keyword arguments are supported when including a component
  template.
- Components can be used interchangably as mixins.
- Elements with `data-ref` or `ref` attributes will be cached in
  `this.refs`.
- Helpers and event listeners are bound to the component instance.
- No manditory class hierarchy or base classes.
- Leverages the templating system without introducing new concepts
  that require low-level modification (i.e. keep Meteor the
  way it is).