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
 * TODO: also support pattern/facet type schemas
 *
 * @param  {String} typeOrTypeSchema
 * @return {[===]}
 */
module.exports = function sample (typeOrTypeSchema) {

  // Facet / pattern type schemas
  if (_.isObject(typeOrTypeSchema) && !_.isEqual(typeOrTypeSchema, []) && !_.isEqual(typeOrTypeSchema, {})) {
    // TODO: instead of using base value, generate a few different examples
    return [coerce(typeOrTypeSchema)];
  }

  // Everything else
  var coreExamples = typeInfo(typeOrTypeSchema).getExamples();
  return _.sample(coreExamples, coreExamples.length);
};
