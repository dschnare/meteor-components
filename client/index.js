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
        // On the component instance there will be a
        // 'templateInstance' property that has a
        // reference to the Blaze.TemplateInstance.
        var email = this.data().email;
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
    alert('Say hello!');
  },

  // Optional method to initialize the component.
  // If your component is a constructor/class then
  // the constructor will be called first before this method.
  init: function () {
    // This will be called to initialize the component.
    // The parent property will be set to the parent
    // component in the component hierarchy. Whereas
    // the children, refs and templateInstance properties
    // will only be set to their defaults (empty array,
    // empty object and undefined respectively).
    //
    // Mixins are guarnteed to have been already initialized so
    // you safely use callFirstWith() or getFirstWith().
  },

  // Optional
  onCreated: function () {
    // onCreated called when template has been created.
    // This is called as a method on your component instance
    // if it exists. At this stage this.templateInstance will be
    // defined on the component, but also the entire template instance
    // API is defined on the component for your convenience.
    // Each property on the template instance including fields
    // are methods on the component of the same name.
    //
    // Mixins are guarnteed to have had their onCreated methods called first.
  },

  // Optional
  onRendered: function () {
    // onRendered called when template has been inserted
    // into the DOM. When the HTML for the template has
    // been materialized and inserted into the DOM any
    // elements that have a 'ref' or 'data-ref' attribute
    // will be referenced in 'this.refs'.
    console.log('Gravatar#onRendered', this.refs.avatar);
    // By this point the 'children' property will have all
    // child components inserted (if your component is a parent).
    //
    // Mixins are guaranteed to have had their onRendered methods called first.
  },

  // Optional
  onDestroyed: function () {
    // onDestroyed called when template has been removed
    // from the DOM without being re-rendered. All built-in
    // properties (parent, children, refs and templateInstance)
    // are still valid at this point, but will be set to null
    // after your onDestroyed() method has been called.
    //
    // Mixins are guaranteed to have had their onDestroyed methods called first.
  }
};

Component.Shell = {};