"use strict";

function merge() {
  var ret = {};
  var args = [].slice.call(arguments, 0);
  args.forEach(function (a) {
    Object.keys(a).forEach(function (k) {
      ret[k] = a[k];
    });
  });
  return ret;
}

var FieldMixin = {
  setField: function setField(field, e) {
    var v = e;
    if (e && e.target) {
      v = e.target.value;
    }
    var newFormData = {};
    newFormData[field] = v;
    this.setState({
      formData: merge(this.state.formData, newFormData)
    });
  },

  handleValidate: function handleValidate(status, formData) {
    this.setState({
      status: merge(this.state.status, status),
      formData: merge(this.state.formData, formData)
    });
  }
};

module.exports = FieldMixin;