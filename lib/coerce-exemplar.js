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
 * @param  {*} value
 * @return {*}
 */
module.exports = function coerceExemplar (value) {

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
      return typeInfo('json').getExemplarDescription();
    }
    else if (typeInfo('ref').isExemplar(valuePart)) {
      return typeInfo('ref').getExemplarDescription();
    }
    else if (typeInfo('lamda').isExemplar(valuePart)) {
      return typeInfo('lamda').getExemplarDescription();
    }
    // arrays need a recursive step
    else if (_.isArray(valuePart)) {
      // multi-item arrays become pattern arrays
      if (valuePart.length > 1) {
        // To do this, we union together all of the items in the array,
        // then use the result as our deduced pattern.
        return [
          _.reduce(valuePart.slice(1), function (patternSoFar, item) {
            item = _recursivelyCoerceExemplar(item); // <= recursive step
            patternSoFar = union(patternSoFar, item, true, false);  // <= flags are `true` (yes these are exemplars) and `false` (no, don't use strict validation rules)
            return patternSoFar;
          }, _recursivelyCoerceExemplar(valuePart[0]) /* <= recursive step */)
        ];
      }
    }
    // dictionaries need a recursive step
    else if (_.isObject(valuePart)) {
      return _.reduce(valuePart, function (dictSoFar, subValue, key) {
        dictSoFar[key] = _recursivelyCoerceExemplar(subValue); // <= recursive step
        return dictSoFar;
      }, {});
    }
    // Finally, if none of the special cases above apply, this valuePart is already
    // good to go, so just return it.
    return valuePart;

  })(value);

};
