/**
 * Module dependencies
 */

var _ = require('lodash');
var typeInfo = require('./type-info');
var getDisplayType = require('./get-display-type');
var coerce = require('./coerce');



/**
 * Given a type name, return a few sample values for it in random order.
 *
 *
 * @param  {String} typeOrTypeSchema
 * @return {[===]}
 */
module.exports = function sample (typeOrTypeSchema) {

  // Facet / pattern type schemas
  if (_.isObject(typeOrTypeSchema) && !_.isEqual(typeOrTypeSchema, []) && !_.isEqual(typeOrTypeSchema, {})) {
    // TODO: instead of using base value, generate a few different examples
    // (this will also fix test)
    return [coerce(typeOrTypeSchema)];
  }

  // Everything else
  var coreExamples = typeInfo(typeOrTypeSchema).getExamples();
  return _.sample(coreExamples, coreExamples.length);
};
