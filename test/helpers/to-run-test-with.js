/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var rttc = require('../../');
var getDisplayType = require('../../lib/helpers/get-display-type');

module.exports = function toRunTestWith(transformationFn) {
  return function _runTest(expectations, cb){

    // Determine type schema of the value.
    // (using inference to pull it from the `example`, if provided)
    var typeSchema;
    if (!_.isUndefined(expectations.type)) {
      typeSchema = expectations.type;
    }
    else {
      typeSchema = rttc.infer(expectations.example);
    }


    // Now validate and/or coerce the actual value against the type schema.
    var actualResult;
    var gotError;
    try {
      actualResult = transformationFn(typeSchema, expectations.actual);
    }
    catch (e) {
      gotError = e;
    }


    // Finally, make sure the right thing happened and that we
    // got the appropriate result.
    //
    //
    // Ensure that if we got an error, we were expecting it.
    if (gotError){
      if (expectations.error) {return cb();}
      return cb(new Error('did not expect error, but got one:\n' + util.inspect(gotError)));
    }
    // Handle case where we were expecting an error, but we didn't get one.
    if (expectations.error) {
      return cb(new Error('expected a error, but did not get one. Instead, returned '+util.inspect(actualResult, false, null)+'.'));
    }


    // If an expected `result` is provided, compare the actual result against that.
    // Otherwise compare it against the original value (`actual`)
    var compareTo = expectations.hasOwnProperty('result') ? expectations.result : expectations.actual;

    // Use a lodash equality check, but customize it a bit
    var _keypath = [];
    var isEquivalent = _.isEqual(actualResult, compareTo, function(value, other, indexOrKey) {

      // Keep track of indices/keys already traversed in order to dereference the appropriate part
      // of the type schema (`indexOrKey` will be undefined if this is the top-level)
      if (!_.isUndefined(indexOrKey)){
        _keypath.push(indexOrKey);
      }

      try {
        // Attempt to look up the appropriate keypath within the type schema, or
        // use the top-level type schema if we haven't tracked any key/indices traversed
        // yet.
        var typeToCompareAgainst = typeSchema;
        if (_keypath.length > 0) {
          typeToCompareAgainst = _.get(typeSchema, _keypath.join('.'));
        }
        // If this type is a lamda, `.toString()` the functions and compare
        // them that way.
        if (typeToCompareAgainst === 'lamda') {
          return (value.toString() === other.toString());
        }
      }
      catch (e){ return false; }

      // If this is not a lamda input, just let the default lodash isEqual handling
      // take care of it.
      return undefined;
    });
    if (!isEquivalent) {
      return cb(new Error('returned incorrect value: '+getDisplayVal(actualResult)+' (a '+getDisplayType(actualResult)+')'));
    }

    // Test using strict equality (===) if explicitly requested
    if (expectations.strictEq) {
      if (actualResult !== compareTo) {
        return cb(new Error('returned value is equivalent (but not ===)'));
      }
    }

    // Test AGAINST strict equality using `isNew` if requested
    // (i.e. guarantees this is a new value and is !== what was passed in)
    if (expectations.isNew) {

      // Check both the expected result and the actual value, just to be safe.
      // (should never even be possible for it to be a direct reference to the expected result)
      if (actualResult === compareTo || actualResult === expectations.actual) {
        return cb(new Error('returned value === value that was passed in -- but should have been a new value!'));
      }
    }

    // If we made it here, everything's good!
    return cb();

  };
};




function getDisplayVal(v){

  if (_.isDate(v)) {
    return 'a Date';
  }
  if (_.isFunction(v)) {
    return v.toString();
  }
  if (_.isError(v)) {
    return 'an Error';
  }
  if (_.isRegExp(v)) {
    return 'a RegExp';
  }
  if (!_.isPlainObject(v) && !_.isArray(v)) {
    return getDisplayType(v);
  }
  return util.inspect(v,false,null);
}
