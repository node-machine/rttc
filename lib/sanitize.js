/**
 * Module dependencies
 */

var _ = require('lodash');
var rebuildSanitized = require('./helpers/sanitize');



/**
 * Sanitize a value to make it JSON-compatible; plus some extra affordances:
 *   • stringifying functions, dates, regexps, and errors, as well
 *   • taking care of circular references
 *   • normalizing -Infinity, Infinity, and NaN (to 0)
 *   • stripping undefined (and potentially null) keys and values.
 *
 * This is used when validating/coercing an array or dictionary (and its contents)
 * against `example: {}` or `example: []`.
 *
 * @param  {===} value
 * @param  {Boolean} allowNull - if set, `null` values will not be stripped from the encoded string.
 * @return {String}
 */
module.exports = function resolve (value, allowNull) {
  return rebuildSanitized(value,allowNull);
};
