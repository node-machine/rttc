/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./types');


/**
 * [validateAndOrCoerceObject description]
 * @param  {[type]} input [description]
 * @param  {[type]} value [description]
 * @param  {[type]} options [description]
 * @return {[type]}       [description]
 */
function validateAndOrCoerceObject(input, value, options) {
  _.each(_.keys(input), function(key) {
    var _input = input[key];
    var _value = value[key];

    // If the input is an object continue recursively parsing it
    if(types.obj.is(_input)) {
      validateAndOrCoerceObject(_input, _value, options);
      return;
    }

    _value = coercePrimitive(_input, _value, { coerce: options.coerce, baseType: options.baseType });
    var valid = validatePrimitive(_input, _value);
    if(!valid) {
      var err = new Error();
      err.code = 'E_INVALID_TYPE';
      err.message = 'Invalid input value '+ value;
      throw new Error(err);
    }

    value[key] = _value;
  });

  // Find the difference in the input and the value and remove any keys that
  // exist on the value but not on the input definition.
  var inputKeys = _.keys(input);
  var valueKeys = _.keys(value);
  var invalidKeys = _.difference(valueKeys, inputKeys);

  _.each(invalidKeys, function(key) {
    delete value[key];
  });

  return value;
}


module.exports = validateAndOrCoerceObject;
