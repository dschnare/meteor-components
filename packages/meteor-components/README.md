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
            var email = this.data().email;
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