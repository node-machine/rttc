/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./helpers/types');
var inferPrimitive = require('./helpers/infer-primitive');


/**
 * Infer the type schema of the provided RTTC exemplar (aka example).
 *
 * @param  {JSON} eg [an rttc exemplar]
 * @return {JSON} [a type schema]
 */
module.exports = function infer(eg) {

  // If the exemplar isn't a dictionary or array, we will derive its primitive type.
  if(!types.dictionary.is(eg) && !types.array.is(eg)) {
    return inferPrimitive(eg);
  }

  // If the exemplar is an array, figure out what to do.
  // For now just check that it's an array.
  if(types.array.is(eg)) {

    // Ensure empty arrays are not recursively parsed.
    if (eg.length === 0) {
      return [];
    }
    // Parse arrays of arrays
    else if (_.isArray(eg[0])) {
      // Recursive step
      return [
        infer(eg[0])
      ];
    }
    // Parse arrays of dictionaries
    else if (_.isObject(eg[0])) {
      // Recursive step (within the helper)
      return [
        inferDictionary(eg[0])
      ];
    }
    // Parse arrays of primitives
    else {
      return [
        inferPrimitive(eg[0])
      ];
    }
  }
  // Otherwise this is a dictionary, so parse it.
  else {
    // Recursive step (within the helper)
    return inferDictionary(eg);
  }



  /**
   * Recursively create a new type schema from a dictionary exemplar.
   * ________________________________________________________________________________
   * @param {Object} obj
   * ________________________________________________________________________________
   * @returns {Object} If this is a dictionary, returns a new schema.
   * @returns {undefined} If `obj` is not a dictionary
   */

  function inferDictionary(obj) {
    if(!types.dictionary.is(obj)) return;

    var newObj = {};
    _.each(_.keys(obj), function(key) {
      var val = obj[key];

      var type;
      if(types.array.is(val)) {
        type = infer(val);
      }
      else if(types.dictionary.is(val)) {
        type = inferDictionary(val);
      }
      else {
        type = inferPrimitive(val);
      }
      newObj[key] = type;
    });

    return newObj;
  }


};
