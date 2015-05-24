/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * A variation on the lodash equality check that uses the expected typeSchema
 * for additional context (it stringifies lamdas and compares them that way)
 *
 * @param  {===} firstValue
 * @param  {===} secondValue
 * @param  {*} typeSchema
 * @return {Boolean}
 */
module.exports = function isEqual (firstValue, secondValue, typeSchema) {

  // Use a lodash equality check, but customize it a bit
  var _keypath = [];
  console.log('\n\n\n');
  console.log('running equality check:');
  console.log(firstValue);
  console.log('vs:');
  console.log(secondValue);
  console.log();
  return _.isEqual(firstValue, secondValue, function(value, other, indexOrKey) {
    // Keep track of indices/keys already traversed in order to dereference the appropriate part
    // of the type schema (`indexOrKey` will be undefined if this is the top-level)
    if (!_.isUndefined(indexOrKey)){
      _keypath.push(indexOrKey);
    }
    console.log(' ('+_keypath.join('.')+') \n•',value,'vs', other);

    // Only do the lamda check if a `typeSchema` was provided.
    if (!_.isUndefined(typeSchema)) {
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
          console.log('Comparing lamdas...');
          return (value.toString() === other.toString());
        }
        else {
          console.log('not lamda, its:', typeToCompareAgainst);
        }
      }
      catch (e){ console.log('ERR',e); return false; }
    }

    // If this is not a lamda input, just let the default lodash isEqual handling
    // take care of it.
    return undefined;
  });
};
