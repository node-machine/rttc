/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var validateRecursive = require('./helpers/validate-recursive');

/**
 * Validate a bit of mystery meat (`actual`) against an `expected` type schema,
 * saving up any fatal errors and throwing them in a lump, and otherwise
 * returning the value that was accepted (i.e. because some coercion might have
 * occurred)
 *
 * @param  {~Schema} expected   type schema
 * @param  {*} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function validate (expected, actual) {

  // Avoid damaging the provided parameters.
  expected = _.cloneDeep(expected);
  actual = _.cloneDeep(actual);

  var errors = [];
  var result = validateRecursive(expected, actual, errors);

  if (errors.length) {
    throw (function (){
      var err = new Error(util.format('%d error(s) validating value:\n', errors.length, errors));
      err.code = errors[0].code;
      err.minor = errors[0].minor;
      err.errors = errors;
      return err;
    })();
  }

  return result;
};


