/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');


/**
 * A variation on JSON.parse that also takes care of a few additional
 * edge-cases including eval-ing stringified functions.
 *
 * TODO: if `typeSchema` is provided, also coerce the decoded value to match.
 *
 * @param  {String} value
 * @param  {*} typeSchema        - optionally provide `typeSchema` so that it can be used to improve the accuracy of the deserialized result (specifically it is necessary to eval lamda functions)
 * @param  {Boolean} unsafeMode  - enable to use `eval` to hydrate stringified functions based on `typeSchema` (this is not safe to use on user-provided input and so is disabled by default)
 * @return {*}
 */
module.exports = function decode (value, typeSchema, unsafeMode) {

  // `unsafeMode` is disabled by default
  unsafeMode = unsafeMode || false;

  if (!_.isString(value)) {
    throw new Error('rttc.decode() expects a string value, but a '+typeof value+' was provided:'+util.inspect(value, false, null));
  }
  if (unsafeMode && _.isUndefined(typeSchema)) {
    throw new Error('rttc.decode() cannot enable `unsafeMode` without also providing a `typeSchema`.');
  }

  var deserializedVal;

  // Attempt to parse provided JSON-encoded value
  try {
    deserializedVal = JSON.parse(value);
  }
  catch (e) {
    throw new Error('Could not JSON.parse() provided value:'+value);
  }

  // Deserialize any lamda functions that exist in the provided input value
  // (but only in `unsafeMode`, and if `typeSchema` is provided)
  //
  // If this is a lamda type, or something which MIGHT contain a lamda type
  // (i.e. nested array or dictionary type schema), we must recursively iterate over the
  // type schema looking for lamda types, and when we find them, parse input values as
  // stringified machine fn bodies, converting them to hydrated JavaScript functions.
  if (unsafeMode && !_.isUndefined(typeSchema) && (typeSchema === 'lamda' || _.isObject(typeSchema) && !_.isEqual(typeSchema, []) && !_.isEqual(typeSchema, {}))) {

    deserializedVal = (function parseLamdaInputValues(val, keysSoFar){

      var typeHere = keysSoFar.length > 0 ? _.get(typeSchema, keysSoFar.join('.')) : typeSchema;

      // If this is supposed to be an array or dictionary, recursively traverse the
      // next leg of the type schema
      //
      // (note that we don't need to worry about circular refs because we've already
      // ensured JSON serializability above)
      if (_.isArray(typeHere)) {
        // if the actual value does not have an array here as expected,
        // just stop looking for lamdas this direction (there obviously aren't any,
        // and it's not the job of this function to catch any validation issues)
        if (!_.isArray(val)) {
          return val;
        }
        // Since a type schema array will only have one item, we must iterate over
        // the actual value:
        return _.reduce(val, function (memo, unused, index){
          memo.push(parseLamdaInputValues(val[index], keysSoFar.concat('0') ));
          return memo;
        }, []);
      }
      else if (_.isObject(typeHere)){
        return _.reduce(typeHere, function (memo, unused, subKey){
          // if the actual value does not have a dictionary here as expected,
          // just stop looking for lamdas this direction (there obviously aren't any,
          // and it's not the job of this function to catch any validation issues)
          if (!_.isObject(val)) {
            return memo;
          }
          memo[subKey] = parseLamdaInputValues(val[subKey], keysSoFar.concat(subKey));
          return memo;
        }, {});
      }

      // If this is supposed to be a lamda, and the actual value is a string,
      // parse a function out of it.  If anything goes wrong, just pass the value
      // through as-is.
      else if (typeHere === 'lamda' && _.isString(val)) {
        try {
          var fn;
          // If the lamda string begins with "function", then we'll assume it's a
          // complete, stringified function.
          if (val.match(/^\s*function/)){
            eval('fn='+val);
          }
          // If the lamda string doesn't begin with "function", then we'll assume it
          // is a function body, and build a machine `fn` out of it (assumes standard
          // `fn` function signature)
          else {
            eval('fn=function(inputs, exits, env){'+val+'}');
          }
          return fn;
        }
        catch (e){
          // Could not parse usable lamda function from provided string-
          // so just pass the value through as-is.
          return val;
        }
      }

      // Otherwise, just return what we've got
      return val;
    })(deserializedVal, []);
  } // </if typeSchema === 'lam..... etc>

  return deserializedVal;
};
