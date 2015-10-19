/**
 * Module dependencies
 */

var _ = require('lodash');
var typeInfo = require('./type-info');
var dehydrate = require('./dehydrate');
var union = require('./union');


/**
 * Convert a normal value into an exemplar representative of the _most specific_ type schema which would accept it.
 *
 * If `allowSpecialSyntax` is set, '->', '*', and '===' take on their traditional special meaning.
 * Otherwise, they will be "exemplified"-- that is, replaced with strings ('an arrow symbol', 'a star symbol', '3 equal signs')
 *
 * @param  {*} value
 * @param  {Boolean} allowSpecialSyntax
 * @return {*}
 */
module.exports = function coerceExemplar (value, allowSpecialSyntax) {

  // Top-level `undefined` becomes `===`
  if (_.isUndefined(value)) {
    return '===';
  }

  // Dehydrate the wanna-be exemplar to avoid circular recursion
  // (but allow null, and don't stringify functions)
  value = dehydrate(value, true, true);


  // Next, iterate over the value and coerce it into a valid rttc exemplar.
  return (function _recursivelyCoerceExemplar(valuePart){

    // `null` becomes '*'
    if (_.isNull(valuePart)) {
      return typeInfo('json').getExemplar();
    }
    // functions become '->'
    else if (_.isFunction(valuePart)) {
      return typeInfo('lamda').getExemplar();
    }
    // and strings which resemble potentially-ambiguous exemplars
    // become their own exemplar description instead (because all of
    // the exemplar descriptions are strings, which is what we want)
    else if (typeInfo('json').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('json').getExemplarDescription();
    }
    else if (typeInfo('ref').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('ref').getExemplarDescription();
    }
    else if (typeInfo('lamda').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('lamda').getExemplarDescription();
    }
    // arrays need a recursive step
    else if (_.isArray(valuePart)) {
      // empty arrays just become generic arrays
      if (valuePart.length === 0) {
        return valuePart;
      }
      // NON-empty arrays become pattern arrays
      // (any extra items beyond the first are folded together, in order to deduce the best pattern exemplar)
      else {
        // To do this, we union together all of the items in the array,
        // then use the result as our deduced pattern.
        var pattern = _.reduce(valuePart.slice(1), function (patternSoFar, item) {
          patternSoFar = union(patternSoFar, _recursivelyCoerceExemplar(item), true, true);  // <= recursive step
          // meaning of `union` flags, in order:
          //  • `true` (yes these are exemplars)
          //  • `true` (yes, use strict validation rules to prevent confusion)
          return patternSoFar;
        }, _recursivelyCoerceExemplar(valuePart[0]) /* <= recursive step */);

        // If the narrowest common schema for the pattern is "===" (ref), that means
        // the schema for the entire pattern array is `['===']`.  If that's the case,
        // we can simply think of it as `[]` (generic/heterogeneous array), since there's
        // no material guarantee of homogeneity anyways (and since that way you're less
        // likely to inadverently deduce any weird conclusions about mutability).
        // So for our purposes here:   `['===']` is the same as `[]`
        return [
          pattern
        ];
      }
    }
    // dictionaries need a recursive step too
    else if (_.isObject(valuePart)) {
      // Note that empty dictionaries just become generic dictionaries.
      return _.reduce(_.keys(valuePart), function (dictSoFar, key) {
        var subValue = valuePart[key];
        dictSoFar[key] = _recursivelyCoerceExemplar(subValue); // <= recursive step
        return dictSoFar;
      }, {});
    }
    // Finally, if none of the special cases above apply, this valuePart is already
    // good to go, so just return it.
    return valuePart;

  })(value);

};
