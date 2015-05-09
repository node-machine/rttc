/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var rttc = require('../../');


module.exports = function testValidation(expectations, cb){

  //
  // Determine type schema of the value.
  // (using inference to pull it from the `example`, if provided)
  //

  var typeSchema;
  if (!_.isUndefined(expectations.type) && !_.isUndefined(expectations.example)) {
    return cb (new Error('invalid test: cannot specify both `type` and `example`'));
  }
  else if (!_.isUndefined(expectations.type)) {
    typeSchema = expectations.type;
  }
  else if (!_.isUndefined(expectations.example)) {
    typeSchema = rttc.infer(expectations.example);
  }
  // console.log('--------------------------');
  // console.log('expectations.example ::',expectations.example);
  // console.log('typeSchema ::',typeSchema);
  // console.log('expectations.actual ::',expectations.actual, '('+typeof expectations.actual+')');
  // console.log('expectations.result ::',expectations.result, '('+typeof expectations.result+')');


  //
  // Now validate the actual value against the type schema.
  //

  var validated;
  var gotError;
  try {
    validated = rttc.validate(typeSchema, expectations.actual);
  }
  catch (e) {
    gotError = e;
  }


  // if (gotError) console.log('gotError? ::',gotError);
  // else console.log('post-validation ::',validated, '('+typeof validated+')');
  // console.log('post-validation ::',validated, '('+typeof validated+')');

  //
  // Finally, make sure the right thing happened and that we
  // got the appropriate result.
  //

  // Ensure that if we got an error, we were expecting it.
  if (gotError){
    if (expectations.error) {return cb();}
    return cb(new Error('did not expect validation error, but got one:\n' + util.inspect(gotError)));
  }

  // Handle case where we were expecting an error, but we didn't get one.
  if (expectations.error) {
    return cb(new Error('expected a validation error, but did not get one. Instead, returned '+util.inspect(validated, false, null))+'.' );
  }

  // TODO: remove this hack.
  if (_.isUndefined(expectations.result)) return cb();

  // Ensure that the actual result matches the test's expectations.
  if (_.isEqual(validated, expectations.result)) {
    return cb();
  }
  return cb(new Error('.validate() returned incorrect value: '+util.inspect(validated, false, null)));

};

