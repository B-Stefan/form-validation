var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;/** @jsx React.DOM */

/**
 * form-validation
 */
var React = require('react');
var AsyncValidate = require('async-validator');
var Validator = require('./Validator');
var actionId = 0;

var Validation = (function(super$0){"use strict";super$0=React.Component;if(!PRS$0)MIXIN$0(Validation, super$0);var proto$0={};
  function Validation(props) {var this$0 = this;
    super$0.call(this, props);
    this.validators = {};
    ['attachValidator', 'detachValidator', 'handleInputChange'].forEach(function(m) {
      this$0[m] = this$0[m].bind(this$0);
    });
  }if(super$0!==null)SP$0(Validation,super$0);Validation.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Validation,"configurable":true,"writable":true}});DP$0(Validation,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.getSchema = function(validator) {
    var ret = {};
    var rules = validator.props.rules;
    if (!Array.isArray(rules)) {
      rules = [rules];
    }
    rules.forEach(function(r) {
      if (!r.validator) {
        r.type = r.type || 'string';// default string type for form field
      }
    });
    ret[validator.getName()] = rules;
    return ret;
  };

  proto$0.getValidateResult = function() {
    var formData = {};
    var status = {};
    var validators = this.validators;
    Object.keys(validators).forEach(function(name) {
      var validator = validators[name];
      var errors = validator.errors && validator.errors.map(function(e) {
          return e.message;
        });
      if (errors && errors.length === 0) {
        errors = null;
      }
      status[name] = {
        errors: errors,
        isValidating: validator.isValidating
      };
      formData[name] = validator.getValue();
    });
    return {
      formData: formData,
      status: status
    };
  };

  proto$0.isValid = function() {
    var result = this.getValidateResult().status;
    return Object.keys(result).every(function(name) {
      if (result[name].isValidating || result[name].errors) {
        return false;
      }
      return true;
    });
  };

  proto$0.attachValidators = function(children) {
    var self = this;
    if (children) {
      return React.Children.map(children, function(child) {
        if (child) {
          if (child.type === Validator) {
            return React.cloneElement(child, {
              attachValidator: self.attachValidator,
              detachValidator: self.detachValidator,
              handleInputChange: self.handleInputChange
            });
          } else if (child.props && child.props.children) {
            return React.cloneElement(child, {}, self.attachValidators(child.props.children));
          }
        }
        return child;
      });
    }
    return children;
  };

  proto$0.handleInputChange = function(validator, value, fn) {
    var values = {};
    var name = validator.getName();
    values[name] = value;
    validator.errors = undefined;
    validator.isValidating = true;
    validator.dirty = true;
    var currentActionId = actionId;
    validator.actionId = currentActionId;
    actionId++;
    var result = this.getValidateResult();
    result.formData[name] = value;
    this.props.onValidate(result.status, result.formData);
    var self = this;
    new AsyncValidate(this.getSchema(validator)).validate(values, function(errors) {
      var validators = self.validators;
      // in case component is unmount and remount
      var nowValidator = validators[name];
      // prevent concurrency call
      if (nowValidator && nowValidator.actionId === currentActionId) {
        validator.errors = errors;
        validator.isValidating = false;
        validator.dirty = false;
        var result = self.getValidateResult();
        result.formData[name] = value;
        self.props.onValidate(result.status, result.formData);
        if (fn) {
          fn();
        }
      }
    });
  };

  proto$0.attachValidator = function(validator) {
    var name = validator.getName();
    this.validators[name] = validator;
  };

  proto$0.detachValidator = function(validator) {
    delete this.validators[validator.getName()];
  };

  proto$0.forceValidate = function(fields, callback) {
    var self = this;
    var validators = this.validators;
    var validator;
    fields = fields || Object.keys(validators);
    var count = fields.length;
    if (count === 0) {
      callback(self.isValid());
      return;
    }

    function track() {
      doing++;
      if (doing === count) {
        if (callback) {
          callback(self.isValid());
        }
      }
    }

    var doing = 0;
    fields.forEach(function(name) {
      validator = validators[name];
      self.handleInputChange(validator, validator.getValue(), track);
    });
  };

  proto$0.validate = function(callback) {var this$0 = this;
    var self = this;
    var validators = this.validators;
    var count = 0;
    var validator;
    Object.keys(validators).forEach(function(name) {
      validator = validators[name];
      if (validator.dirty) {
        count++;
      }
    });

    if (count === 0) {
      callback(self.isValid());
      return;
    }

    function track() {
      doing++;
      if (doing === count) {
        callback(self.isValid());
      }
    }

    var doing = 0;
    Object.keys(validators).forEach(function(name) {
      validator = validators[name];
      if (validator.dirty) {
        this$0.handleInputChange(validator, validator.getValue(), track);
      }
    });
  };

  proto$0.reset = function() {
    var validators = this.validators;
    Object.keys(validators).forEach(function(name) {
      validators[name].reset();
    });
  };

  proto$0.render = function() {
    return React.createElement("div", {className: this.props.className}, this.attachValidators(this.props.children));
  };
MIXIN$0(Validation.prototype,proto$0);proto$0=void 0;return Validation;})();

Validation.propTypes = {
  onChange: React.PropTypes.func
};

Validation.defaultProps = {
  onValidate: function() {
  }
};

Validation.Validator = Validator;

Validation.FieldMixin = require('./FieldMixin');

module.exports = Validation;
