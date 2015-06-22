/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * intersection()
 *
 * Given two rttc type schemas, return the most specific type schema that
 * accepts the shared subset of values accepted by both. Formally, this subset is the
 * intersection of A and B (A ∩ B), where A is the set of values accepted by `schema0`
 * and B is the set of values accepted by `schema1`.  If `A ∩ B` is the empty set, then
 * this function will return `null`.  Otherwise it will return the type schema that precisely
 * accepts `A ∩ B`.
 *
 * @param  {*} schema0
 * @param  {*} schema1
 * @return {*}
 */
module.exports = function intersection (schema0, schema1) {



  /*
  Type intersection:
  (intersection is used to determine a new example for a circuit input)

  // Special cases:
  // inside a generic dictionary keypath: act like 'json'
  // inside a generic array keypath: act like 'json'
  // inside a JSON keypath: act like 'json'
  // inside a ref keypath: act like 'ref'
  // inside any other keypath: not possible, that's an error (will be caught during stabilization, so we can ignore)

  // Types always intersect with themselves, with an identity result.
  'string'  ∩  'string'          <====> 'string'
  'number'  ∩  'number'          <====> 'number'
  'boolean'  ∩  'boolean'        <====> 'boolean'
  'lamda'  ∩  'lamda'            <====> 'lamda'
  {}  ∩  {}                      <====> {}
  []  ∩  []                      <====> []
  'json'  ∩  'json'              <====> 'json'
  'ref'  ∩  'ref'                <====> 'ref'

  // Every type except "ref" and "lamda" intersects with "json", with an identity result.
  'string'     ∩  'json'          <====> 'string'
  'number'     ∩  'json'          <====> 'number'
  'boolean'    ∩  'json'          <====> 'boolean'
  {}           ∩  'json'          <====> {}
  []           ∩  'json'          <====> []
  {x:'string'} ∩  'json'          <====> {x:'string'}
  ['string']   ∩  'json'          <====> ['string']

  // Every type intersects with "ref", with an identity result.
  'string'     ∩  'ref'           <====> 'string'
  'number'     ∩  'ref'           <====> 'number'
  'boolean'    ∩  'ref'           <====> 'boolean'
  {}           ∩  'ref'           <====> {}
  []           ∩  'ref'           <====> []
  {x:'string'} ∩  'ref'           <====> {x:'string'}
  ['string']   ∩  'ref'           <====> ['string']
  'lamda'      ∩  'ref'           <====> 'lamda'
  'json'       ∩  'ref'           <====> 'json'

  // Strings, numbers, booleans, and lamdas do not intersect with each other,
  // or with any sort of dictionary or array type.
  'string'  ∩  (anything else)    <==/==> (ERROR)
  'number'  ∩  (anything else)    <==/==> (ERROR)
  'boolean' ∩  (anything else)    <==/==> (ERROR)
  'lamda'   ∩  (anything else)    <==/==> (ERROR)

  // Faceted dictionaries intersect with generic dictionaries, with an identity result.
  {a:'string'} ∩ {}               <====> {a:'string'}
  {a:{}} ∩ {}                     <====> {a:{}}

  // Patterned arrays intersect with generic arrays, with an identity result.
  ['string']  ∩  []               <====> ['string']
  [[{}]]  ∩  []                   <====> [[{}]]
  [{}]  ∩  ['string']             <====> ['string']

  // Faceted dictionaries intersect with other faceted dictionaries as long as recursive
  // types also successfully intersect. The result is the merged type schema.
  // (extra keys are ok, since they'll just be ignored)
  {a:'string'} ∩ {a:'string',b:'string'}         <====> {a:'string', b: 'string'}
  {x:'string'} ∩ {a:'string',b:'string'}         <====> {a:'string', b: 'string', x: 'string'}
  {x:'string', a:'number'} ∩ {a:'string',b:'string'} <==/=> (ERROR)
  {x:'string', a:'json'}   ∩ {a:'string',b:'string'} <====> {a:'string', b: 'string', x: 'string'}

  // Patterned arrays intersect with other patterned arrays as long as the recursive
  // types also successfully intersect.  The result is the merged type schema.
  ['number'] ∩ ['json']           <====> ['number']
  ['number'] ∩ ['string']         <==/=> (ERROR)
  [{a:'number'}] ∩ [{}]           <====> [{a:'number'}]

  */


  // Configure two-headed type schema cursor and use it to recursively
  // determine the type schema intersection.
  var twoHeadedCursor = buildTwoHeadedCursor(
    function onFacetDict(facetDictionary, schema1, parentKeyOrIndex, iterateRecursive){

      var isIncompatible;
      var intersectedFacetDict = _.reduce(facetDictionary, function (memo, val, key) {
        var intersectedFacet = iterateRecursive(key);
        if (_.isNull(intersectedFacet)) {
          isIncompatible = true;
          return memo;
        }

        memo[key] = intersectedFacet;
        return memo;
      }, {});

      if (isIncompatible) {
        return null;
      }
      return intersectedFacetDict;
    },
    function onPatternArray(patternArray, schema1, parentKeyOrIndex, iterateRecursive){
      if (!_.isArray(schema1)) {
        return null;
      }
      var intersectedPattern = iterateRecursive(0);
      if (_.isNull(intersectedPattern)) {
        return null;
      }
      return [ intersectedPattern ];
    },
    function onGenericDict(schema0, schema1, parentKeyOrIndex){
      if (!_.isArray(schema1) && _.isObject(schema1)) {
        return schema1;
      }
      return null;
    },
    function onGenericArray(schema0, schema1, parentKeyOrIndex){
      if (_.isArray(schema1)) {
        return schema1;
      }
      return null;
    },
    function onJson(schema0, schema1, parentKeyOrIndex) {

      if (_.isArray(schema1)) {
        return schema1;
      }
      if (_.isObject(schema1)) {
        return schema1;
      }

      switch (schema1) {
        case 'json':
        case 'ref':
          return 'json';

        case 'string':
          return 'string';

        case 'number':
          return 'number';

        case 'boolean':
          return 'boolean';

        default:
          return null;
      }
    },
    function onRef(schema0, schema1, parentKeyOrIndex) {
      return schema1;
    },
    function onLamda(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'lamda':
        case 'ref':
          return 'lamda';

        default:
          return null;
      }
    },
    function onString(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'string':
        case 'json':
        case 'ref':
          return 'string';

        default:
          return null;
      }
    },
    function onNumber(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'number':
        case 'json':
        case 'ref':
          return 'number';

        default:
          return null;
      }
    },
    function onBoolean(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'boolean':
        case 'json':
        case 'ref':
          return 'boolean';

        default:
          return null;
      }
    }
  );

  // Run the iterator to get the type schema intersection.
  return twoHeadedCursor(schema0, schema1);

};








/**
 * Builds a two-headed cursor useful for comparing type schemas.
 *
 * @param  {[type]} onFacetDict    [description]
 * @param  {[type]} onPatternArray [description]
 * @param  {[type]} onGenericDict  [description]
 * @param  {[type]} onGenericArray [description]
 * @param  {[type]} onJson         [description]
 * @param  {[type]} onRef          [description]
 * @param  {[type]} onLamda        [description]
 * @param  {[type]} onString       [description]
 * @param  {[type]} onNumber       [description]
 * @param  {[type]} onBoolean      [description]
 * @return {[type]}                [description]
 */
function buildTwoHeadedCursor(onFacetDict, onPatternArray, onGenericDict, onGenericArray, onJson, onRef, onLamda, onString, onNumber, onBoolean) {

  function _iterator(subSchema0, subSchema1, keyOrIndex){
    if (_.isArray(subSchema0)) {
      if (_.isEqual(subSchema0, [])) {
        return onGenericArray(subSchema0, subSchema1, keyOrIndex);
      }
      return onPatternArray(subSchema0, subSchema1, keyOrIndex, function (nextIndex){
        var nextSchema0 = subSchema0[nextIndex];
        var nextSchema1 = subSchema1[nextIndex];
        return _iterator(nextSchema0, nextSchema1, nextIndex);
      });
    }
    else if (_.isObject(subSchema0)) {
      if (_.isEqual(subSchema0, {})) {
        return onGenericDict(subSchema0, subSchema1, keyOrIndex);
      }
      return onFacetDict(subSchema0, subSchema1, keyOrIndex, function (nextKey) {
        var nextSchema0 = subSchema0[nextKey];
        var nextSchema1 = subSchema1[nextKey];
        return _iterator(nextSchema0, nextSchema1, nextKey);
      });
    }
    else if (_.isEqual(subSchema0, 'json')) {
      return onJson(subSchema0, subSchema1, keyOrIndex);
    }
    else if (_.isEqual(subSchema0, 'boolean')) {
      return onBoolean(subSchema0, subSchema1, keyOrIndex);
    }
    else if (_.isEqual(subSchema0, 'number')) {
      return onNumber(subSchema0, subSchema1, keyOrIndex);
    }
    else if (_.isEqual(subSchema0, 'string')) {
      return onString(subSchema0, subSchema1, keyOrIndex);
    }
    else if (_.isEqual(subSchema0, 'lamda')) {
      return onLamda(subSchema0, subSchema1, keyOrIndex);
    }
    else if (_.isEqual(subSchema0, 'ref')) {
      return onRef(subSchema0, subSchema1, keyOrIndex);
    }
    else {
      throw new Error('Unrecognized type.');
    }
  }

  /**
   * @param  {*} thingToTraverse
   * @return {*}
   */
  return function (thingToTraverse0, thingToTraverse1){
    return _iterator(thingToTraverse0, thingToTraverse1);
  };

};
