/**
 * Module dependencies
 */

var _ = require('lodash');
var rebuild = require('./rebuild');


/**
 * validateExemplarStrict()
 *
 * Check the specified value (`supposedExemplar`) and ensure it is
 * a pure RTTC exemplar. If not, throw an error.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param  {Anything} supposedExemplar
 *         The supposed exemplar to validate.
 *
 * @throws {Error} If the provided `supposedExemplar` is not a pure RTTC exemplar.
 *         @property {String} code
 *                   The error intentionally thrown from here always has a `code`
 *                   property of `E_INVALID_EXEMPLAR`.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Example usage:
 *
 * ```
 * > x
 *    => { foo: 23, bar: 8, baz: { yeah: 'cool!', what: [Circular] } }
 *
 * > rttc.validateExemplarStrict([{a:'Whee', b: 9, c: x}])
 *    => Error: Invalid exemplar: Only strictly JSON-serializable values can qualify to be RTTC exemplars.
 *         at Object.validateExemplarStrict (/Users/mikermcneil/code/rttc/lib/validate-exemplar-strict.js:47:11)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
module.exports = function validateExemplarStrict (supposedExemplar) {

  // Used below.
  var err;

  // Check for obvious bad news.
  if (_.isUndefined(supposedExemplar)) {
    err = new Error('Invalid exemplar: `undefined` is not a valid RTTC exemplar.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }
  if (_.isNull(supposedExemplar)) {
    err = new Error('Invalid exemplar: `null` is not a valid RTTC exemplar.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }

  // Check for nested nulls, and ensure serializability while we're at it.
  var rebuiltExemplar = rebuild(supposedExemplar, function transformPrimitive (val){
    if (_.isNull(val)) {
      err = new Error('Invalid exemplar: Nested `null`s are not allowed in an RTTC exemplar.');
      err.code = 'E_INVALID_EXEMPLAR';
      throw err;
    }
    return val;
  }, function transformDictOrArray(val, type) {
    if (type === 'array' && val.length > 1) {
      err = new Error('Invalid exemplar: Multi-item arrays (at any depth) are not allowed in an RTTC exemplar.');
      err.code = 'E_INVALID_EXEMPLAR';
      throw err;
    }
    return val;
  });

  // Rebuilding the exemplar should have caused it not to change.
  // (if it did, it means it was circular, or that it contained things that
  //  could not be losslessly serialized to JSON and back again)
  if (!_.isEqual(supposedExemplar, rebuiltExemplar)) {
    err = new Error('Invalid exemplar: Only strictly JSON-serializable values can qualify to be RTTC exemplars.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }

};
