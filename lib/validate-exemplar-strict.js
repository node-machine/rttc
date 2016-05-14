/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * validateExemplarStrict()
 *
 * Check the specified value (`supposedExemplar`) and ensure it is
 * a pure RTTC exemplar. If not, throw an error.
 *
 * @param  {Anything} supposedExemplar
 *         The supposed exemplar to validate.
 *
 * @param  {Boolean} allowMultiItemArrays
 *         If set, multi-item arrays will not cause the validation to fail.
 *         @default false
 *
 * @throws {Error} If the provided `supposedExemplar` is not a pure RTTC exemplar.
 */
module.exports = function validateExemplarStrict (supposedExemplar, allowMultiItemArrays) {

  // Check for obvious bad news.
  if (_.isUndefined(supposedExemplar)) {
    throw new Error('Invalid exemplar: `undefined` is not a valid RTTC exemplar.');
  }
  if (_.isUndefined(supposedExemplar)) {
    throw new Error('Invalid exemplar: `null` is not a valid RTTC exemplar.');
  }

  // Check for nested nulls, and ensure serializability while we're at it.
  var rebuiltExemplar = rebuild(supposedExemplar, function (sub){
    if (_.isNull(sub)) {
      throw new Error('Invalid exemplar: Nested `null`s are not allowed in an RTTC exemplar.');
    }
    return sub;
  });

  // Rebuilding the exemplar should have caused it not to change.
  if (_.isEqual(supposedExemplar, rebuiltExemplar)) {
    // ??
  }

  // TODO: multi-item arrays.


};
