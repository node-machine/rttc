/**
 * Module dependencies
 */

var _ = require('lodash');
var TYPES = require('./helpers/types');

/**
 * Given a value, return a sorta human-readable type string representing **its type**.
 *
 * > ------------------------------------------------------------------------
 * > THIS WILL LIKELY BE DEPRECATED IN FAVOR OF MORE SPECIFIC HELPER METHODS
 * > IN A FUTURE VERSION OF RTTC.
 * > ------------------------------------------------------------------------
 *
 * @param  {===} val
 * @return {String}
 */
module.exports = function getDisplayType(val){

  // `undefined` should take precedence over special exemplar syntax
  // (i.e. '===')
  if (_.isUndefined(val)) return 'undefined';

  if (TYPES.json.isExemplar(val)) return 'json';
  if (TYPES.lamda.isExemplar(val)) return 'lamda';
  if (TYPES.ref.isExemplar(val)) return 'ref';
  if (_.isEqual(val, Infinity) || _.isEqual(val, -Infinity) || _.isNaN(val)) {
    return 'invalid number';
  }
  if (_.isString(val)) return 'string';
  if (_.isNumber(val)) return 'number';
  if (_.isBoolean(val)) return 'boolean';
  if (_.isNull(val)) return 'null';
  if (_.isArray(val)) return 'array';
  if (_.isFunction(val)) return 'function';
  if (_.isDate(val)) return 'Date';
  if (_.isError(val)) return 'Error';
  if (_.isRegExp(val)) return 'RegExp';

  // If it's an object
  if (_.isObject(val)) {
    var displayType = typeof val;
    try {
      displayType = val.constructor.name;
      if (displayType.match(/object/i) && _.isPlainObject(val)) {
        return 'dictionary';
      }
      // Use the constructor name if it's anything other than "Object"
      return displayType;
    }
    catch (e){}
  }

  // ok.. wtf is it?
  return 'unknown';

};
