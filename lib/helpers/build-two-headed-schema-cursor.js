/**
 * Module dependencies
 */

var _ = require('lodash');




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
module.exports = function buildTwoHeadedSchemaCursor(onFacetDict, onPatternArray, onGenericDict, onGenericArray, onJson, onRef, onLamda, onString, onNumber, onBoolean) {

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

}
