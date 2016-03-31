/**
 * Module dependencies
 */

var rebuildRecursive = require('./helpers/rebuild-recursive');


/**
 * rebuild()
 *
 * Rebuild a potentially-recursively-deep value, running
 * the specified `handleLeafTransform` lifecycle callback
 * (aka transformer function) for every primitive (i.e. string,
 * number, boolean, null) and function.
 *
 * @param {Anything} val
 * @param {Anything} handleLeafTransform
 *        @param {Anything} leafVal
 *        @param {String} leafType [either string, number, boolean, null, or lamda]
 *
 * @returns {JSON}
 */
module.exports = function rebuild(val, handleLeafTransform){
  return rebuildRecursive(val, handleLeafTransform);
};
