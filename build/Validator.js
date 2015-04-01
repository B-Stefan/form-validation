"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/** @jsx React.DOM */

var React = require("react");
var createChainedFunction = require("rc-util").createChainedFunction;

var Validator = (function (_React$Component) {
  function Validator(props) {
    _classCallCheck(this, Validator);

    _get(Object.getPrototypeOf(Validator.prototype), "constructor", this).call(this, props);
    this.reset();
    this.handleChange = this.handleChange.bind(this);
  }

  _inherits(Validator, _React$Component);

  _createClass(Validator, {
    reset: {
      value: function reset() {
        this.errors = undefined;
        this.dirty = true;
        this.isValidating = false;
        // in case component is unmount and remount
        this.actionId = -1;
      }
    },
    handleChange: {
      value: function handleChange(e) {
        // support custom element
        var value = e.target ? e.target.value : e;
        this.props.handleInputChange(this, value);
      }
    },
    getName: {
      value: function getName() {
        return React.Children.only(this.props.children).props.name;
      }
    },
    getValue: {
      value: function getValue() {
        return React.Children.only(this.props.children).props.value;
      }
    },
    render: {
      value: function render() {
        var child = React.Children.only(this.props.children);
        return React.cloneElement(child, {
          onChange: createChainedFunction(child.props.onChange, this.handleChange)
        });
      }
    },
    componentDidMount: {
      value: function componentDidMount() {
        this.props.attachValidator(this);
        //console.log(this.getName()+' mount');
      }
    },
    componentDidUpdate: {
      value: function componentDidUpdate() {
        this.props.attachValidator(this);
      }
    },
    componentWillUnmount: {
      value: function componentWillUnmount() {
        this.props.detachValidator(this);
        //console.log(this.getName()+' unmount');
      }
    }
  });

  return Validator;
})(React.Component);

Validator.propTypes = {
  attachValidator: React.PropTypes.func,
  detachValidator: React.PropTypes.func,
  handleInputChange: React.PropTypes.func
};

module.exports = Validator;