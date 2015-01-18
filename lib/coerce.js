/**
 * Module dependencies
 */

var util = require('util');
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

  // Avoid damaging `expected`
  expected = _.cloneDeep(expected);

  // Jump into recursive validation
  var result = validateRecursive(expected, actual, errors, true);

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
