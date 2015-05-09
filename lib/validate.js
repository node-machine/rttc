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
  // (true => `ensureSerializable` -- i.e. ensure the thing is JSON-serializable)

  // Strip out any "minor" E_INVALID_TYPE errors--
  // These are ok since we can just coerce the `actual` value to resolve them.
  _.remove(errors, {code: 'E_INVALID_TYPE', minor: true});
  // currently we don't do anything w/ the tracked errors
  // (if anyone runs across the need, it's very easy to make ^this behavior
  // configurable-- just need to wrap an `if` around this.  Make an issue or send a PR.
  // To track that there were minor errors, we could also save the result of the _.remove
  // call, which is an array of the removed items.  Just a question of how to expose that.
  // Probably would be best just to make a separate function for "strict" validation.)

  // If there are still errors, coallesce the remaining list of errors into a single
  // Error object we can throw.
  if (errors.length > 0) {
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


