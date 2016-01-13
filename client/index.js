/*global CryptoJS*/
// Show Gravatar avatar image.
// See: https://secure.gravatar.com/site/implement/hash/
//
// For simplicity this component is defined as a simple
// object. However, this could have been an ES6 class or
// a normal constructor function. Meteor Components
// accepts either a constructor function or a simple object.
Component.Gravatar = {
  // Specify optional template helpers.
  // Like Blaze Components, having helpers defined
  // as a method that returns a hash makes it easier
  // to extend or override. Helpers are bound to the
  // component instance.
  helpers: function () {
    return {
      gravatarUrl: function () {
        // 'this' is the component instance.
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
  },

  // Specify optional template events.
  // Just like helpers, each event listener is bound to the
  // component instance.
  events: function () {
    return {
      'click img': function () {
        this.sayHello();
      }
    };
  },

  // This is an example of a "private" helper. A method
  // that is only available on the component instance and
  // cannot be used by the template directly.
  sayHello: function () {
    alert('Hello from ' + this.data('id') + '!');
  },

  initialize: function () {
    console.log('Gravatar#initialize', this.parent);
  },

  ready: function () {
    console.log('Gravatar#ready', this.refs.avatar);
  },

  destroy: function () {
    console.log('Gravatar#destroy');
  }
};

Component.Shell = class {
  initialize() {
    console.log('Shell#initialize');
  }

  ready() {
    console.log('Shell#ready');
  }

  destroy() {
    console.log('Shell#destroy');
  }
};

Component.Shell2 = class {
  static template() { return 'Shell'; }

  initialize() {
    console.log('Shell2#initialize');
  }

  ready() {
    console.log('Shell2#ready');
  }

  destroy() {
    console.log('Shell2#destroy');
  }
};