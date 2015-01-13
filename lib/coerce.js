/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('rttc');


module.exports = function coerce () {
  return rttc(inputSchema, test, {coerce: true});
};
