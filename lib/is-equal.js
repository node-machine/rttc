/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * A variation on the lodash equality check that uses the expected typeSchema
 * for additional context (it stringifies lamdas and compares them that way)
 *
 * @param  {===} actualResult
 * @param  {===} compareTo
 * @param  {*} typeSchema
 * @return {Boolean}
 */
module.exports = function isEqual (actualResult, compareTo, typeSchema) {

  // Use a lodash equality check, but customize it a bit
  var _keypath = [];
  return _.isEqual(actualResult, compareTo, function(value, other, indexOrKey) {

    // Keep track of indices/keys already traversed in order to dereference the appropriate part
    // of the type schema (`indexOrKey` will be undefined if this is the top-level)
    if (!_.isUndefined(indexOrKey)){
      _keypath.push(indexOrKey);
    }

    try {
      // Attempt to look up the appropriate keypath within the type schema, or
      // use the top-level type schema if we haven't tracked any key/indices traversed
      // yet.
      var typeToCompareAgainst = typeSchema;
      if (_keypath.length > 0) {
        typeToCompareAgainst = _.get(typeSchema, _keypath.join('.'));
      }
      // If this type is a lamda, `.toString()` the functions and compare
      // them that way.
      if (typeToCompareAgainst === 'lamda') {
        return (value.toString() === other.toString());
      }
    }
    catch (e){ return false; }

    // If this is not a lamda input, just let the default lodash isEqual handling
    // take care of it.
    return undefined;
  });
};
