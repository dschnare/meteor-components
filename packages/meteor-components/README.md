# Meteor Components

Meteor Components is a simple, lightweight component extension for Meteor
templates.


## Quick Start

    <template name="index">
      {{>Gravatar email="myemail@email.com"}}
    </template>

    <template name="Gravatar">
      <img src="{{gravatarUrl}}" />
    </template>

    // Show Gravatar avatar image.
    // See: https://secure.gravatar.com/site/implement/hash/
    Component.Gravatar = {
      helpers: function () {
        return {
          gravatarUrl: function () {
            // this.data() is a method call to retrieve
            // templateInstance.data, but if you specify a key path
            // the key path access will be reactive.
            var email = this.data('email');
            if (email) {
              email = email.replace(/^\s|\s$/g, '');
              var hash = CryptoJS.MD5(email);
              return "http://www.gravatar.com/avatar/" + hash;
            }
          }
        };
      }
    };


## Reference

Reference documentation comming soon! In the mean time take a look at the
[GitHub](https://github.com/dschnare/meteor-components) repo.