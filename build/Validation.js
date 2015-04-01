"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/** @jsx React.DOM */

/**
 * form-validation
 */
var React = require("react");
var AsyncValidate = require("async-validator");
var Validator = require("./Validator");
var actionId = 0;

var Validation = (function (_React$Component) {
  function Validation(props) {
    var _this2 = this;

    _classCallCheck(this, Validation);

    _get(Object.getPrototypeOf(Validation.prototype), "constructor", this).call(this, props);
    this.validators = {};
    ["attachValidator", "detachValidator", "handleInputChange"].forEach(function (m) {
      _this2[m] = _this2[m].bind(_this2);
    });
  }

  _inherits(Validation, _React$Component);

  _createClass(Validation, {
    getSchema: {
      value: function getSchema(validator) {
        var ret = {};
        var rules = validator.props.rules;
        if (!Array.isArray(rules)) {
          rules = [rules];
        }
        rules.forEach(function (r) {
          if (!r.validator) {
            r.type = r.type || "string"; // default string type for form field
          }
        });
        ret[validator.getName()] = rules;
        return ret;
      }
    },
    getValidateResult: {
      value: function getValidateResult() {
        var formData = {};
        var status = {};
        var validators = this.validators;
        Object.keys(validators).forEach(function (name) {
          var validator = validators[name];
          var errors = validator.errors && validator.errors.map(function (e) {
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
      }
    },
    isValid: {
      value: function isValid() {
        var result = this.getValidateResult().status;
        return Object.keys(result).every(function (name) {
          if (result[name].isValidating || result[name].errors) {
            return false;
          }
          return true;
        });
      }
    },
    attachValidators: {
      value: function attachValidators(children) {
        var self = this;
        if (children) {
          return React.Children.map(children, function (child) {
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
      }
    },
    handleInputChange: {
      value: function handleInputChange(validator, value, fn) {
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
        new AsyncValidate(this.getSchema(validator)).validate(values, function (errors) {
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
      }
    },
    attachValidator: {
      value: function attachValidator(validator) {
        var name = validator.getName();
        this.validators[name] = validator;
      }
    },
    detachValidator: {
      value: function detachValidator(validator) {
        delete this.validators[validator.getName()];
      }
    },
    forceValidate: {
      value: function forceValidate(fields, callback) {
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
        fields.forEach(function (name) {
          validator = validators[name];
          self.handleInputChange(validator, validator.getValue(), track);
        });
      }
    },
    validate: {
      value: function validate(callback) {
        var _this2 = this;

        var self = this;
        var validators = this.validators;
        var count = 0;
        var validator;
        Object.keys(validators).forEach(function (name) {
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
        Object.keys(validators).forEach(function (name) {
          validator = validators[name];
          if (validator.dirty) {
            _this2.handleInputChange(validator, validator.getValue(), track);
          }
        });
      }
    },
    reset: {
      value: function reset() {
        var validators = this.validators;
        Object.keys(validators).forEach(function (name) {
          validators[name].reset();
        });
      }
    },
    render: {
      value: function render() {
        return React.createElement("div", { className: this.props.className }, this.attachValidators(this.props.children));
      }
    }
  });

  return Validation;
})(React.Component);

Validation.propTypes = {
  onChange: React.PropTypes.func
};

Validation.defaultProps = {
  onValidate: function onValidate() {}
};

Validation.Validator = Validator;

Validation.FieldMixin = require("./FieldMixin");

module.exports = Validation;