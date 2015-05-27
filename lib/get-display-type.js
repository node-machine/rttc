/**
 * Module dependencies
 */

var _ = require('lodash');
var infer = require('./infer');


/**
 * Given a value, return a human-readable type string.
 * Useful for error messages, user interfaces, etc.
 *
 * The recognized types are identical to those of `infer()`, but instead
 * of returning a type schema, this function returns
 * Just like `infer()` `undefined` is understood as "ref", and `null`
 * is understood as "json".
 *
 * @param  {===} val
 * @return {String}
 */
module.exports = function getDisplayType(val){

  var typeSchema;
  try {
    typeSchema = infer(val);
  }
  catch (e) {}

  switch (typeSchema) {
    case 'ref':
      return 'mutable reference (===)';
    case 'lamda':
      return 'lambda function (->)';
    case 'json':
      return 'JSON-compatible value (*)';
    default:
      if (_.isEqual(infer(val), [])) {
        return 'any array ([])';
      }
      if (_.isEqual(infer(val), {})) {
        return 'any dictionary ({})';
      }
      if (_.isArray(infer(val))) {
        return 'array';
      }
      var displayType = typeof val;
      try {
        displayType = val.constructor.name;
        if (displayType.match(/object/i)) {
          return 'dictionary';
        }
      }
      catch (e){}
      return displayType;
  }

};
