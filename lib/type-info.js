/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./helpers/types');


/**
 * Given a type, return an object containing more informatino about it.
 * Useful for error messages, user interfaces, etc.
 *
 * The recognized types are identical to those of `infer()`, but instead
 * of returning a type schema, this function returns an object containing
 * more information about whatever the top-level type is.
 *
 * @param  {String} type
 * @return {Object}
 */
module.exports = function typeInfo(type){

  if (_.isArray(type)) {
    return _.cloneDeep(types.array);
  }
  if (_.isObject(type)) {
    return _.cloneDeep(types.dictionary);
  }
  if (_.isString(type) && types[type]) {
    return _.cloneDeep(types[type]);
  }
  throw new Error('Unknown type: "'+type+'"');

};
