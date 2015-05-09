/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');

/**
 * Combine an array of errors into a single Error object.
 *
 * @param  {Array} errors
 * @return {Error}
 */
module.exports = function consolidateErrors (errors) {
  // If there are still errors, coallesce the remaining list of errors into a single
  // Error object we can throw.
  if (errors.length === 0) return;
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
};


