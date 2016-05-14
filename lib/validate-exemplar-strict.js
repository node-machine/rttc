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

  // Check for obvious bad news.
  if (_.isUndefined(supposedExemplar)) {
    throw new Error('Invalid exemplar: `undefined` is not a valid RTTC exemplar.');
  }
  if (_.isNull(supposedExemplar)) {
    throw new Error('Invalid exemplar: `null` is not a valid RTTC exemplar.');
  }

  // Check for nested nulls, and ensure serializability while we're at it.
  var rebuiltExemplar = rebuild(supposedExemplar, function transformPrimitive (val){
    if (_.isNull(val)) {
      throw new Error('Invalid exemplar: Nested `null`s are not allowed in an RTTC exemplar.');
    }
    return val;
  }, function transformDictOrArray(val, type) {
    if (type === 'array' && val.length > 1) {
      throw new Error('Invalid exemplar: Nested `null`s are not allowed in an RTTC exemplar.');
    }
    return val;
  });

  // Rebuilding the exemplar should have caused it not to change.
  // (if it did, it means it was circular, or that it contained things that
  //  could not be losslessly serialized to JSON and back again)
  if (!_.isEqual(supposedExemplar, rebuiltExemplar)) {
    throw new Error('Invalid exemplar: Only strictly JSON-serializable values can qualify to be RTTC exemplars.');
  }

};
