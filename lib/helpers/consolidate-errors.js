/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');

/**
 * Combine an array of errors into a single Error object.
 *
 * @param  {Array} errors
 * @param  {String} msgSuffix
 * @return {Error}
 */
module.exports = function consolidateErrors (errors, msgSuffix) {

  // If there are errors, coallesce them into a single Error object we can throw.
  if (errors.length === 0) {
    return;
  }

  // Remove duplicate E_COERCION / E_INVALID_TYPE errors.
  var uniqueErrors = _.uniq(errors, function disregardValidationErrCode(err){
    return err.actual+err.expected+err.inputKey;
  });

  var err = new Error(util.format('%d error(s)%s:\n', uniqueErrors.length, (msgSuffix?(' '+msgSuffix):''), uniqueErrors));
  err.code = uniqueErrors[0].code;

  // If any of the original errors are not "minor", then this is not a "minor" error.
  err.minor = _.reduce(errors, function(memo, subError) {
    if (!memo || !subError.minor) {
      return false;
    }
    return true;
  }, true);
  // Don't include `minor` property if it's falsy.
  if (!err.minor) delete err.minor;

  // Expose duplicate-free list of errors as `err.errors`
  err.errors = uniqueErrors;

  return err;
};


