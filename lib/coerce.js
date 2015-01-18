/**
 * Module dependencies
 */

var util = require('util');
var Stream = require('stream').Stream;
var _ = require('lodash');
var validateRecursive = require('./helpers/validate-recursive');

/**
 * Coerce value to type schema
 * (very forgiving)
 *
 * @param  {~Schema} expected   type schema
 * @param  {*} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function coerce (expected, actual){

  var errors = [];

  // If `actual` is an object, ensure that it is JSON-serializable.
  //
  // Special exception to JSON serialization rule if expecting a "machine",
  // or if `actual` is an array, buffer, or stream.
  if (expected !== 'machine' && !_.isArray(actual) && !(actual instanceof Buffer) && !(actual instanceof Stream) && _.isObject(actual)){
    try {
      actual = JSON.parse(JSON.stringify(actual));
    }
    catch (e){
      actual = {};
    }
  }

  // Avoid damaging the provided parameters.
  expected = _.cloneDeep(expected);
  actual = _.cloneDeep(actual);

  // Jump into recursive validation
  var result = validateRecursive(expected, actual, errors);

  // Strip out "E_INVALID_TYPE" errors- they are ok if we're just coercing.
  _.remove(errors, {code: 'E_INVALID_TYPE'});

  // Strip out "E_COERCION" errors- they are ok if we're just coercing.
  _.remove(errors, {code: 'E_COERCION'});

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
