/**
 * Module dependencies
 */

var TEST_SUITE = require('../spec/coercion.spec');
var runSuite = require('../spec/helpers/run-suite');
var toRunTestWith = require('./helpers/to-run-test-with');
var rttc = require('../');

describe('.coerce()', function (){
  runSuite(TEST_SUITE, toRunTestWith(rttc.coerce) );
});
