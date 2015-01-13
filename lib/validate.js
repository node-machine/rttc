/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('./rttc');


module.exports = function validate (expected, actual) {
  // TODO: make this the top-level method instead of rttc
  // and share common fn dependencies
  return rttc(expected, actual);
};
