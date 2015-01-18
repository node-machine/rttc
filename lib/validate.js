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

  var errors = [];
  var result = validateRecursive(expected, actual, errors, true);

  if (errors.length) {
    throw (function (){
      var err = new Error(util.format('%d error(s) validating value:\n', errors.length, errors));
      err.code = errors[0].code;
      // If any of the errors are not "minor", then this is not a "minor" error.
      err.minor = _.reduce(errors, function(memo, subError) {
        if (!memo || !subError.minor) {
          return false;
        }
        return true;
      }, true);
      err.errors = errors;
      return err;
    })();
  }

  return result;
};


