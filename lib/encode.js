/**
 * Module dependencies
 */

var _ = require('lodash');
var rebuildSanitized = require('./helpers/sanitize');


/**
 * A variation on JSON.stringify that also takes care of a few additional
 * edge-cases like stringifying functions, dates, regexps, and errors, as well
 * as taking care of circular references, normalizing -Infinity, Infinity, and NaN (to 0)
 * and stripping undefined keys and values.  If `allowNull` is set, `null` values will not
 * be stripped from the encoded string.
 *
 * @param  {===} value
 * @param  {Boolean} allowNull
 * @return {String}
 */
module.exports = function encode (value, allowNull) {
  // TODO: optimize
  return JSON.stringify(rebuildSanitized(value,allowNull));
};
