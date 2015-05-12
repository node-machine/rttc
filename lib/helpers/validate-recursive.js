/**
 * Module dependencies
 */

var util = require('util');
var Stream = require('stream').Stream;
var _ = require('lodash');
var types = require('./types');



/**
 *
 * @param  {*} expected
 * @param  {*} actual
 * @param  {Array} errors  [errors encountered along the way are pushed here]
 * @param  {Boolean} ensureSerializable
 * @return {*} coerced value
 */
module.exports = function _validateRecursive (expected, actual, errors, ensureSerializable, meta, strict){

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;
  var isExpectingAnything;
  var allowAnyArray;
  var allowAnyDictionary;

  // console.log('\n');
  // console.log('expecting:',expected);
  // console.log('actual:',require('util').inspect(actual, false, null), require('util').format('(a %s)', getDisplayType(actual)));
  function getDisplayType(x){
    var displayType;
    displayType = typeof x;
    try {
      displayType = x.constructor.name;
    }
    catch (e){}
    return displayType;
  }

  // console.log('validating',actual,'against',expected,'...');


  // Flag '*' (allow anything that's not undefined)
  if (expected === '*') {
    isExpectingAnything = true;
  }
  // Normalize: [] or "array" (allow any array)
  if (expected === 'array' || (_.isArray(expected) && expected.length === 0)) {
    expected = [];
    allowAnyArray = true;
  }
  // Normalize: "dictionary" or {} (allow any dictionary)
  if (expected === 'dictionary' || (_.isPlainObject(expected) && _.keys(expected).length === 0)) {
    expected = {};
    allowAnyDictionary = true;
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
  // string, boolean, number, and '*'
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
  if(_.isUndefined(actual)) {
    coercedValue = expectedType.getBase();
  }

  // Check `actual` value using `expectedType.is()`
  if (!expectedType.is(actual)){


    // Build an E_INVALID_TYPE error
    var newErr = (function (){
      var msg = util.format(
        'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
        'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
      );
      if (meta && meta.keyName) {
        msg = 'For key `'+meta.keyName+'`: ' + msg;
      }
      var err = new Error(msg);
      if (meta && meta.keyName) {
        err.inputKey = meta.keyName;
      }
      err.actual = util.inspect(actual, false, null);
      err.expected = util.inspect(expected, false, null);
      err.code = 'E_INVALID_TYPE';

      // This is considered a "minor" error if it can be coerced without
      // causing any errors.
      try {
        expectedType.to(actual);
        err.minor = true;
      }
      catch (e) {}
      return err;
    })();

    // Don't bother tracking minor errors unless we're in `strict` mode.
    if (!newErr.minor || (strict && newErr.minor)) {
      errors.push(newErr);
    }


    // Invalid expected type.  Try to coerce:
    try {
      coercedValue = expectedType.to(actual);
    }
    catch (e) {

      // If that doesn't work, use the base type:
      coercedValue = expectedType.getBase();

      // But also push an error
      errors.push((function (){
        var msg = util.format(
          'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
          'This cannot be coerced into the specified type: \n' + util.inspect(expected, false, null)
        );
        if (meta && meta.keyName) {
          msg = 'For key `'+meta.keyName+'`: ' + msg;
        }
        var err = new Error(msg);
        if (meta && meta.keyName) {
          err.inputKey = meta.keyName;
        }
        err.actual = util.inspect(actual, false, null);
        err.expected = util.inspect(expected, false, null);
        err.code = 'E_COERCION';
        return err;
      })());
    }
  }
  // else {
  //   console.log('actual:',actual,' IS EXPECTED TYPE.');
  // }

  // Build partial result
  // (taking recursive step if necessary)

  // ...expecting ANYTHING ('*')
  if (isExpectingAnything) {
    return coercedValue;
  }


  if (isExpectingArray) {

    // ...expecting ANY array ([])
    if (allowAnyArray) {
      return recursivelyCloneAndStripUndefinedKeysFromDictionaries(coercedValue);
    }

    // ...expecting a specific array example
    var arrayItemTpl = expected[0];
    return _.reduce(coercedValue, function (memo, coercedVal){
      memo.push(_validateRecursive(arrayItemTpl, coercedVal, errors, ensureSerializable, undefined, strict));
      return memo;
    }, []);
  }

  if (isExpectingDictionary) {

    // ...expecting ANY dictionary ({})
    if (allowAnyDictionary){
      return recursivelyCloneAndStripUndefinedKeysFromDictionaries(coercedValue);
    }
    // ...expecting a specific dictionary example
    return _.reduce(expected, function (memo, expectedVal, expectedKey) {
      var keyName = (meta && meta.keyName ? (meta.keyName + '.') : '') + expectedKey;
      memo[expectedKey] = _validateRecursive(expected[expectedKey], coercedValue[expectedKey], errors, ensureSerializable, {keyName: keyName}, strict);
      return memo;
    }, {});
  }

  // ...expecting a primitive
  return coercedValue;
};






/**
 *
 */
function recursivelyCloneAndStripUndefinedKeysFromDictionaries(val) {

  // (note that the recursive validation will not penetrate deeper into this
  //  object, so we don't have to worry about this function running more than once
  //  and doing unnecessary extra deep copies at each successive level)


  // If dictionary:
  // ==============================================================================
  // Sanitize a dictionary provided for a wildcard dictionary example (`example: {}`)
  // The main recursive validation function will not descend into this dictionary because
  // it's already met the minimum requirement of being an object.  So we need to deep clone
  // the provided value for safety; and in the process ensure that it meets the basic minimum
  // quality requirements (i.e. no dictionaries within have any undefined keys)
  //
  // At this point, we can be sure that the provided value is a plain object
  // (otherwise it would have been caught by the coercion step, since in order to
  //  be considered a "dictionary", a value has to pass a _.isPlainObject() check)


  // If array:
  // ==============================================================================
  // Sanitize an array provided for a wildcard array example (`example: []`)
  // The main recursive validation function will not descend into this array because
  // it's already met the minimum requirement of being `_.isArray()`.  So we need to
  // deep clone the provided value for safety; and in the process ensure that it meets
  // the basic minimum quality requirements (i.e. no dictionaries within have any undefined
  // keys)
  //
  // (NOTE: `example: ['*']` won't make it here because it will be picked up
  // by the recursive validation.  And so it's different-- it will contain
  // the original items, and therefore may contain dictionaries w/ undefined keys)
  //
  // At this point, we can be sure that the provided value is an array
  // (otherwise it would have been caught by the coercion step, since in order to
  //  be considered an "array", a value has to pass a _.isArray() check)


  function _recurse (val) {
    if (_.isArray(val)) {
      return _.reduce(val,function (memo, item, i) {
        memo.push(_recurse(item));
        return memo;
      }, []);
    }
    else if (_.isObject(val)) {
      return _.reduce(val,function (memo, subVal, key) {
        if (!_.isUndefined(subVal)) {
          memo[key] = _recurse(subVal);
        }
        return memo;
      }, {});
    }
    else {
      return val;
    }
  }

  // TODO: prevent against endless circular recursion

  // Build a deep copy
  // (in the process, remove keys with undefined values from nested dictionaries recursively)
  return _recurse(val);
}

