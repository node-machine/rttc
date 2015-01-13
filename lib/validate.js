/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('./rttc');


module.exports = function validate (expected, actual) {
  return rttc(expected, actual);
};
