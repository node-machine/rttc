/**
 * Module dependencies
 */

var runSuite = require('./helpers/run-suite');
var validate = require('../').validate;
var TEST_SUITE = require('./spec/validation.spec');

describe('.validate()', function (){

  runSuite(TEST_SUITE, validate);

});

