/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./types');



/**
 * Given a tuple value, check it for primitives
 * ________________________________________________________________________________
 * @param  {*} val      there's that "mystery meat" again
 * ________________________________________________________________________________
 * @returns {String}
 */

function checkTuple(val) {

  var type;

  // Check for string
  if(types.str.is(val)) type = 'string';

  // Check for number
  if(types.number.is(val)) type = 'number';

  // Check for boolean
  if(types.bool.is(val)) type = 'boolean';

  return type;
}


/**
 * Recursively perform a destructive mutatation on an object
 * to set tuple types.
 * ________________________________________________________________________________
 * @param {Object} obj
 * ________________________________________________________________________________
 * @returns {Object} Always.
 */

function parseObject(obj) {
  if(!types.obj.is(obj)) return;

  _.each(_.keys(obj), function(key) {
    var val = obj[key];
    var type;

    if(types.arr.is(val)) type = 'array';
    if(types.obj.is(val)) return parseObject(val);
    type = checkTuple(val);
    obj[key] = type;
  });

  return obj;
}




/**
 * Given an example, parse it to infer it's primitive type.
 * ________________________________________________________________________________
 * @param  {*} example
 * ________________________________________________________________________________
 * @returns {Object}
 */

function inferPrimitiveType(example) {

  // If the example isn't an object or array we can run through the primatives and see
  // if any match.

  if(!types.obj.is(example) && !types.arr.is(example)) {
    return checkTuple(example);
  }

  // If the example is an array, figure out what to do. For now just check that it's an array
  if(types.arr.is(example)) {
    // Parse arrays of objects
    if (_.isObject(example[0])) {
      return [parseObject(example[0])];
    }
    // TODO -- Parse arrays of arrays
    // ---

    // Parse arrays of primitives
    return [checkTuple(example[0])];
  }

  // Otherwise parse the object
  return parseObject(example);

}

module.exports = inferPrimitiveType;
