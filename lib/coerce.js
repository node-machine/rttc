/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('./rttc');


module.exports = function coerce (expected, actual) {
  return rttc(expected, actual, {
    coerce: true
  });
};
