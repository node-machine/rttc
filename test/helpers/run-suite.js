/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var runTest = require('./run-test');


module.exports = function runSuite( testSuite, transformationFn ){

  // Run each test.
  _.each(testSuite, function (test){
    describeAndExecuteTest(test, transformationFn);
  });

};

/**
 * Describe a mocha test based on the provided definition.
 *
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function describeAndExecuteTest(test, transformationFn){
  var actualDisplayName = (_.isObject(test.actual)&&test.actual.constructor && test.actual.constructor.name !== 'Object' && test.actual.constructor.name !== 'Array')?test.actual.constructor.name:util.inspect(test.actual, false, null);

  describe((function _determineDescribeMsg(){
    var msg = '';

    if (test._meta) {
      msg += '['+test._meta+']';
    }
    else {
      msg += ' ';
    }

    if (!_.isUndefined(test.example)) {
      msg += 'with a '+getDisplayType(test.example)+' example ('+util.inspect(test.example,false, null)+')';
    }
    else {
      msg +='with example===`undefined`';
    }

    return msg;
  })(), function suite (){
    if (test.error) {
      it(util.format('should error when %s is provided', actualDisplayName), function (done){
        runTest(test, transformationFn, done);
      });
      return;
    }

    it(util.format('should coerce %s', actualDisplayName, 'into '+util.inspect(test.result, false, null)+''), function (done){
      runTest(test, transformationFn, done);
    });
  });
}


/**
 * private helper fn
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function getDisplayType(x){
  var displayType;
  displayType = typeof x;
  try {
    displayType = x.constructor.name;
  }
  catch (e){}
  return displayType;
}
