/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var types = require('./types');



/**
 * Coerce value to type schema.
 *
 * @param  {~Schema} expected   type schema
 * @param  {*} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function coerce (expected, actual){

  // Avoid damaging the provided parameters.
  expected = _.cloneDeep(expected);
  actual = _.cloneDeep(actual);

  var errors = [];
  var result = _coerceRecursive(expected, actual, errors);

  if (errors.length) {
    throw (function (){
      var err = new Error(util.format('%d error(s) coercing value:\n', errors.length, errors));
      err.code = errors[0].code;
      err.errors = errors;
      return err;
    })();
  }

  return result;
};


function _coerceRecursive (expected, actual, errors){

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;

  // Arrays
  if (_.isArray(expected)) {
    expectedType = types.arr;
    isExpectingArray = true;
  }
  // Dictionaries
  else if (_.isObject(expected)) {
    expectedType = types.obj;
    isExpectingDictionary = true;
  }
  // Primitives
  else {
    expectedType = types[expected];

    // If this refers to an unknown type, throw an error
    if (_.isUndefined(expectedType)) {
      throw (function (){
        var err = new Error('Unknown type: '+expected);
        err.code = 'E_UNKNOWN_TYPE';
        return err;
      })();
    }
  }

  // If the actual value is undefined, fill in with the
  // appropriate base type.
  if(types.undefined.is(actual)) {
    return expectedType.getBase();
  }

  // Default the coercedValue to the actual value.
  var coercedValue = actual;

  // Check `actual` value against expectedType
  if (!expectedType.is(actual)){

    // Invalid expected type.  Try to coerce:
    try {
      coercedValue = expectedType.to(actual);
    }
    catch (e) {
      // If that doesn't work...
      errors.push((function (){
        var err = new Error(util.format(
          'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
          'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
        ));
        err.code = 'E_INVALID_TYPE';
        return err;
      })());
      coercedValue = expectedType.getBase();
    }
  }

  // Build partial result
  // (taking recursive step if necessary)
  if (isExpectingArray) {
    var arrayItemTpl = expected[0];
    return _coerceRecursive(arrayItemTpl, coercedValue[0], errors);
  }
  if (isExpectingDictionary) {
    return _.reduce(expected, function (memo, expectedVal, expectedKey) {
      memo[expectedKey] = _coerceRecursive(expected[expectedKey], coercedValue[expectedKey], errors);
      return memo;
    }, {});
  }
  return coercedValue;
}
