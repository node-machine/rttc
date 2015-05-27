/**
 * Module dependencies
 */

var _ = require('lodash');
var typeInfo = require('./type-info');
var coerce = require('./coerce');
var dehydrate = require('./dehydrate');



/**
 * Given a type name, return an array of `n` sample values for it in random order.
 *
 *
 * @param  {String} typeSchema
 * @param  {Number} n  (defaults to 2)
 * @return {[===]}
 */
module.exports = function sample (typeSchema, n) {

  // Default `n` to 2
  n = _.isUndefined(n) ? 2 : n;

  // Dehydrate the type schema to avoid circular recursion
  var dehydratedTypeSchema = dehydrate(typeSchema);

  // Configure type schema iterator
  var generateSampleVal = buildIterator(
    function onFacetDict(facetDictionary, parentKeyOrIndex, callRecursive){
      return _.reduce(facetDictionary, function (memo, val, key) {
        var facet = callRecursive(val, key);
        memo[key] = facet;
        return memo;
      }, {});
    },
    function onPatternArray(patternArray, parentKeyOrIndex, iterateRecursive){
      var pattern = iterateRecursive(patternArray[0], 0);
      return [ pattern ];
    },
    function onGenericDict(schema, parentKeyOrIndex){
      return {};
    },
    function onGenericArray(schema, parentKeyOrIndex){
      return [];
    },
    function onOther(schema, parentKeyOrIndex){
      // Pick a random example
      var example = _.sample(typeInfo(schema).getExamples());
      return example;
    }
  );

  // Generate some sample values
  var samples = _.reduce(_.range(n), function (memo, i) {
    memo.push(generateSampleVal(dehydratedTypeSchema));
    return memo;
  }, []);

  // Scramble them and return.
  return _.shuffle(samples);
};




/**
 * Build an iterator/reducer function for a type schema that builds up and returns a new value.
 *
 * @param  {Function} onFacetDict
 *         -> @param {Object} facetDictionary
 *         -> @param {String} parentKeyOrIndex
 *         -> @param {Function} iterateRecursive(nextSchema, nextKey)
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onPatternArray
 *         -> @param {Array} patternArray
 *         -> @param {String} parentKeyOrIndex
 *         -> @param {Function} iterateRecursive(nextSchema, nextIndex)
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onGenericDict
 *         -> @param {Object} schema  -- (this is always `{}`)
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onGenericArray
 *         -> @param {Array} schema  -- (this is always `[]`)
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onOther
 *         -> @param {*} schema
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @return {Function}
 */
function buildIterator(onFacetDict, onPatternArray, onGenericDict, onGenericArray, onOther) {

  /**
   * @param  {*} subSchema  [description]
   * @param  {} keyOrIndex [description]
   * @return {[type]}            [description]
   */
  function _iterator(subSchema, keyOrIndex){
    if (_.isArray(subSchema)) {
      if (_.isEqual(subSchema, [])) {
        return onGenericArray(subSchema, keyOrIndex);
      }
      return onPatternArray(subSchema, keyOrIndex, function (nextSchema, nextIndex){
        return _iterator(nextSchema, nextIndex);
      });
    }
    else if (_.isObject(subSchema)) {
      if (_.isEqual(subSchema, {})) {
        return onGenericDict(subSchema, keyOrIndex);
      }
      return onFacetDict(subSchema, keyOrIndex, function (nextSchema, nextKey) {
        return _iterator(nextSchema, nextKey);
      });
    }
    else {
      return onOther(subSchema, keyOrIndex);
    }
  }

  /**
   * @param  {*} thingToTraverse
   * @return {*}
   */
  return function (thingToTraverse){
    return _iterator(thingToTraverse);
  };
}
