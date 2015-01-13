/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./types');




/**
 * Given a type and primitive value, check that it matches.
 * ________________________________________________________________________________
 * @param  {String} type     the expected type
 *
 * @param  {*} val           the "mystery meat"
 * ________________________________________________________________________________
 * @return {Boolean}         is this a match?
 */

module.exports = function validatePrimitive (type, val) {

  // Check for string
  if(type === 'string') {
    return types.str.is(val);
  }

  // Check for number
  if(type === 'number') {
    return types.number.is(val);
  }

  // Check for boolean
  if(type === 'boolean') {
    return types.bool.is(val);
  }

  return false;
};
