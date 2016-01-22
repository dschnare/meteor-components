/*global Component*/
Component.on('initializing', (component, templateInstance)  => {
  component.attachedProperties = attachedProperties;
  component.attachedProperty = attachedProperty;
});

function attachedProperty(name) {
  let parts = name.split('.');
  let data = this.data() || {};
  let prop = null;

  if (parts.length === 2 && name in data) {
    prop = () => this.data(name);
    prop.nonReactive = () => this.data()[name];
  } else {
    prop = () => undefined;
    prop.nonReactive = prop;
  }

  return prop;
}

function attachedProperties(namespace) {
  if (typeof namespace === 'string' && namespace) {
    let prefix = namespace + '.';
    return (name) => this.attachedProperty(prefix + name);
  } else {
    let prop = () => undefined;
    prop.nonReactive = prop;
    return prop;
  }
}