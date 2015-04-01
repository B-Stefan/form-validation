var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;/** @jsx React.DOM */

var React = require('react');
var createChainedFunction = require('rc-util').createChainedFunction;

var Validator = (function(super$0){"use strict";super$0=React.Component;if(!PRS$0)MIXIN$0(Validator, super$0);var proto$0={};
  function Validator(props) {
    super$0.call(this, props);
    this.reset();
    this.handleChange = this.handleChange.bind(this);
  }if(super$0!==null)SP$0(Validator,super$0);Validator.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Validator,"configurable":true,"writable":true}});DP$0(Validator,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.reset = function() {
    this.errors = undefined;
    this.dirty = true;
    this.isValidating = false;
    // in case component is unmount and remount
    this.actionId = -1;
  };

  proto$0.handleChange = function(e) {
    // support custom element
    var value = e.target ? e.target.value : e;
    this.props.handleInputChange(this, value);
  };

  proto$0.getName = function() {
    return React.Children.only(this.props.children).props.name;
  };

  proto$0.getValue = function() {
    return React.Children.only(this.props.children).props.value;
  };

  proto$0.render = function() {
    var child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      onChange: createChainedFunction(child.props.onChange, this.handleChange)
    });
  };

  proto$0.componentDidMount = function() {
    this.props.attachValidator(this);
    //console.log(this.getName()+' mount');
  };

  proto$0.componentDidUpdate = function() {
    this.props.attachValidator(this);
  };

  proto$0.componentWillUnmount = function() {
    this.props.detachValidator(this);
    //console.log(this.getName()+' unmount');
  };
MIXIN$0(Validator.prototype,proto$0);proto$0=void 0;return Validator;})();

Validator.propTypes = {
  attachValidator: React.PropTypes.func,
  detachValidator: React.PropTypes.func,
  handleInputChange: React.PropTypes.func
};

module.exports = Validator;
