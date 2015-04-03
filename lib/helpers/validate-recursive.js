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
module.exports = function _validateRecursive (expected, actual, errors, ensureSerializable, meta){

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;
  var allowAnyArray;
  var allowAnyDictionary;

  // console.log('\n');
  // console.log('expecting:',expected, util.format('(a %s)', getDisplayType(actual)));
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

  // "*" (allow anything)
  if (expected === '*'){
    // TODO: reconsider this-- might be confusing... probably better just to pass through `undefined`
    return _.isUndefined(actual) ? '' : actual;
  }

  // Normalize: ["*"] or [] or "array" (allow any array)
  if (expected === 'array' || (_.isArray(expected) && (expected[0] === '*' || expected.length === 0))) {
    expected = ['*'];
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



  // Ensure that `actual` is JSON-serializable, unless one of the following is true:
  // - the `ensureSerializable` flag is disabled
  // - we're expecting a "machine", "buffer", or "stream" and the mystery meat looks right enough
  //
  // Notes:
  // + this can be disabled by setting the `ensureSerializable` argument to false (i.e. for performance)
  // + this will strip all functions
  // + cloning buffers breaks them-- also it is potentially a huge waste of RAM)
  // + cloning streams is a bad idea because it disregards the state they're in, event listeners, etc.)
  if (ensureSerializable &&
    expected !== 'machine' &&
    expected !== 'buffer' &&
    expected !== 'stream'
    ) {

    // if (
    //   // If we're not expecting a buffer, but it looks like we got one, don't serialize it to JSON and back
    //   // (it will end up looking like an array, which is confusing)
    //   // !(expected !== 'buffer' && _.isObject(actual) && actual instanceof Buffer)

    // ) {
      try {
        actual = JSON.parse(JSON.stringify(actual));
      }
      catch (e){
        // Push an E_INVALID_TYPE error
        errors.push((function (){
          var msg = util.format(
            'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
            'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
          );
          if (meta && meta.keyName) {
            msg = "For key `"+meta.keyName+"`: " + msg;
          }
          var err = new Error(msg);
          if (meta && meta.keyName) {
            err.inputKey = meta.keyName;
          }
          err.actual = util.inspect(actual, false, null);
          err.expected = util.inspect(expected, false, null);
          err.code = 'E_INVALID_TYPE';

          // if not expecting a dictionary or an array, and actual value is not
          // a dictionary or array, then this is just a "minor" thing.
          // No big deal, you know.
          if (!isExpectingDictionary && !isExpectingArray && !_.isObject(actual)) {
            err.minor = true;
          }
          return err;
        })());
        actual = {};
      }
    // }
  }
  // TODO: probably should clone machine defs as well.



  // Default the coercedValue to the actual value.
  var coercedValue = actual;

  // If the actual value is undefined, fill in with the
  // appropriate base type.
  if(_.isUndefined(actual)) {
    coercedValue = expectedType.getBase();
  }

  // Check `actual` value using `expectedType.is()`
  if (!expectedType.is(actual)){


    // Push an E_INVALID_TYPE error
    errors.push((function (){
      var msg = util.format(
        'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
        'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
      );
      if (meta && meta.keyName) {
        msg = "For key `"+meta.keyName+"`: " + msg;
      }
      var err = new Error(msg);
      if (meta && meta.keyName) {
        err.inputKey = meta.keyName;
      }
      err.actual = util.inspect(actual, false, null);
      err.expected = util.inspect(expected, false, null);
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
        var msg = util.format(
          'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
          'This cannot be coerced into the specified type: \n' + util.inspect(expected, false, null)
        );
        if (meta && meta.keyName) {
          msg = "For key `"+meta.keyName+"`: " + msg;
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

  // console.log('coercedValue:',util.inspect(coercedValue, false, null), util.format('(a %s)', (function(){
  //   var displayType;
  //   displayType = typeof coercedValue;
  //   try {
  //     displayType = coercedValue.constructor.name;
  //   }
  //   catch (e){}
  //   return displayType;
  // })()));


  // Build partial result
  // (taking recursive step if necessary)
  if (isExpectingArray) {
    if (allowAnyArray){
      return coercedValue;
    }
    var arrayItemTpl = expected[0];
    return _.reduce(coercedValue, function (memo, coercedVal){
      memo.push(_validateRecursive(arrayItemTpl, coercedVal, errors, ensureSerializable));
      return memo;
    }, []);
  }
  if (isExpectingDictionary) {
    if (allowAnyDictionary){
      return coercedValue;
    }
    return _.reduce(expected, function (memo, expectedVal, expectedKey) {
      var keyName = (meta && meta.keyName ? (meta.keyName + ".") : "") + expectedKey;
      memo[expectedKey] = _validateRecursive(expected[expectedKey], coercedValue[expectedKey], errors, ensureSerializable, {keyName: keyName});
      return memo;
    }, {});
  }
  return coercedValue;
};
