/**
 * Module dependencies
 */

var _ = require('lodash');
var types = require('./types');



/**
 * Run-time type checking. Given a set of typed inputs, ensure the run-time configured
 * inputs are valid.
 * ________________________________________________________________________________
 * @param  {String} type   the expected type
 *
 * @param  {*}      val    the "mystery meat"
 *
 * @param  {Object} flags  an object of boolean flags
 * @property {Boolean} coerce
 * @property {Boolean} baseType
 * ________________________________________________________________________________
 * @returns {*} If everything worked
 *              the value that what was formerly "mystery meat", now coerced to `type`.
 * @throws {E_UNDEFINED_VAL} If there were validation errors
 */

module.exports = function coercePrimitive (type, val, flags) {

  var coerceFlag = flags && flags.coerce || false;
  var baseTypeFlag = flags && flags.baseType || false;

  // Map types that are shorthand
  var to = type;
  if(type === 'string') to = 'str';
  if(type === 'boolean') to = 'bool';

  // WARNING: Will throw if the value can't be coerced
  if(!coerceFlag) return val;

  try {

    // If val === undefined lets throw and either error or use the base type
    if(val === undefined) {
      var err = new Error();
      err.code = 'E_UNDEFINED_VAL';
      err.message = 'Undefined value';
      throw err;
    }

    val = types[to].to(val);
  }
  catch (e) {
    // If we want the base type for this input catch it here
    if(!baseTypeFlag) throw e;
    val = types[to].base && types[to].base();
  }

  return val;
};

