/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var rttc = require('../../');
var getDisplayType = require('../../lib/helpers/get-display-type');
var isEquivalent = require('../../spec/helpers/is-equivalent');



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
