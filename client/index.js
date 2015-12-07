Component.index = {
  init() {
    console.log('index init');
  },

  onCreated(tpl) {
    console.log('index created', !!tpl);
  },

  onRendered(tpl) {
    console.log('index rendered', !!tpl);
  }
};

Template.Button.helpers({
  yep: function () { console.log('yep', this); }
});

Component.Button = class {
  helpers() {
    return {
      nope: function () {
        console.log('nope', this);
      }
    };
  }

  events() {
    return {
      'click button': function () {
        console.log(this)
        alert('click!');
      }
    }
  }

  constructor() {
    console.log('Button constructor')
  }

  onCreated() {
    console.log('Button created');
  }

  onRendered(tpl) {
    console.log('button rendered', this.refs);
  }
};