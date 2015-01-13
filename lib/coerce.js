/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('./rttc');


module.exports = function coerce (expected, actual) {
  return rttc({
    x: expected
  }, {
    x: actual
  }, {
    coerce: true
  });
};
