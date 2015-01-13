/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./types');



/**
 * Given a value, check it for primitives
 * ________________________________________________________________________________
 * @param  {*} val      there's that "mystery meat" again
 * ________________________________________________________________________________
 * @returns {String}
 */

function getTypeOfPrimitive(val) {

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
 * @returns {Object} If this is an object
 * @returns {undefined} If `obj` is not an object
 */

function getObjectSchema(obj) {
  if(!types.obj.is(obj)) return;

  _.each(_.keys(obj), function(key) {
    var val = obj[key];
    var type;

    if(types.arr.is(val)) type = 'array';
    if(types.obj.is(val)) return getObjectSchema(val);
    type = getTypeOfPrimitive(val);
    obj[key] = type;
  });

  return obj;
}




/**
 * Given an example, parse it to infer its schema.
 * ________________________________________________________________________________
 * @param  {*} example
 * ________________________________________________________________________________
 * @returns {*} a schema object
 */

function inferSchema(example) {

  // If the example isn't an object or array, we will derive its primitive type.
  if(!types.obj.is(example) && !types.arr.is(example)) {
    return getTypeOfPrimitive(example);
  }

  // If the example is an array, figure out what to do.
  // For now just check that it's an array.
  if(types.arr.is(example)) {

    // Parse arrays of arrays
    if (_.isArray(example[0])) {
      console.log('amking recursive hop on:',example[0]);
      return [inferSchema(example[0])];
    }

    // Parse arrays of objects
    if (_.isObject(example[0])) {
      return [getObjectSchema(example[0])];
    }

    // Parse arrays of primitives
    return [getTypeOfPrimitive(example[0])];
  }

  // Otherwise parse the object
  return getObjectSchema(example);

}

module.exports = inferSchema;
