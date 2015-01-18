/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var types = require('./types');



module.exports = function _validateRecursive (expected, actual, errors){

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;

  // "*" (allow anything)
  if (expected === '*'){
    return _.isUndefined(actual) ? '' : actual;
  }
  // ["*"] or [] or "array" (allow any array)
  if (expected === 'array' || (_.isArray(expected) && (expected[0] === '*' || expected.length === 0))) {
    return _.isArray(actual) ? actual : [];
  }
  // "dictionary" or {} (allow any dictionary)
  if (expected === 'dictionary' || (_.isPlainObject(expected) && _.keys(expected).length === 0)) {
    return (!_.isArray(actual) && _.isObject(actual)) ? actual : {};
  }

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

    // If this refers to an unknown type, default
    // to a string's base type and remember the error.
    if (_.isUndefined(expectedType)) {
      errors.push((function (){
        var err = new Error('Unknown type: '+expected);
        err.code = 'E_UNKNOWN_TYPE';
        return err;
      })());
      return types.string.getBase();
    }

  }


  // Default the coercedValue to the actual value.
  var coercedValue = actual;

  // If the actual value is undefined, fill in with the
  // appropriate base type.
  if(types.undefined.is(actual)) {
    coercedValue = expectedType.getBase();
  }

  // Check `actual` value against expectedType
  if (!expectedType.is(actual)){


    // Push an E_INVALID_TYPE error
    errors.push((function (){
      var err = new Error(util.format(
        'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
        'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
      ));
      err.code = 'E_INVALID_TYPE';

      // if not expecting a dictionary or an array, and actual value is not
      // a dictionary or array, then this is just a "minor" thing.
      // No big deal, you know.
      if (!isExpectingDictionary && !isExpectingArray && !_.isObject(actual)) {
        err.minor = true;
      }
      return err;
    })());

    // Invalid expected type.  Try to coerce:
    try {
      coercedValue = expectedType.to(actual);
    }
    catch (e) {

      // If that doesn't work, use the base type:
      coercedValue = expectedType.getBase();

      // But also push an error
      errors.push((function (){
        var err = new Error(util.format(
          'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
          'This cannot be coerced into the specified type: \n' + util.inspect(expected, false, null)
        ));
        err.code = 'E_COERCION';
        return err;
      })());
    }

    console.log('ACTUAL:',actual);
    console.log('EXPECTED:',expected);
    console.log('COERCED:',coercedValue);
  }


  // Build partial result
  // (taking recursive step if necessary)
  if (isExpectingArray) {
    var arrayItemTpl = expected[0];
    return [_validateRecursive(arrayItemTpl, coercedValue[0], errors)];
  }
  if (isExpectingDictionary) {
    return _.reduce(expected, function (memo, expectedVal, expectedKey) {
      memo[expectedKey] = _validateRecursive(expected[expectedKey], coercedValue[expectedKey], errors);
      return memo;
    }, {});
  }
  return coercedValue;
};
