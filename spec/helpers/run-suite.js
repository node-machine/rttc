/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');


module.exports = function runSuite( testSuite, runTestFn ){

  // Run each test.
  _.each(testSuite, function (test){
    describeAndExecuteTest(test, runTestFn);
  });

};

/**
 * Describe a mocha test based on the provided definition.
 *
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function describeAndExecuteTest(test, runTestFn){

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
    else if (!_.isUndefined(test.typeclass)) {
      msg += 'with typeclass===`'+test.typeclass+'`';
    }
    else {
      msg +='with example===`undefined`';
    }

    return msg;
  })(), function suite (){
    if (test.error) {
      it(util.format('should error when %s is provided', actualDisplayName), function (done){
        runTestFn(test, done);
      });
      return;
    }

    it(util.format('should coerce %s', actualDisplayName, 'into '+util.inspect(test.result, false, null)+''), function (done){
      runTestFn(test, done);
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
  if (x === '*') {
    return '*';
  }
  displayType = typeof x;
  try {
    displayType = x.constructor.name;
  }
  catch (e){}
  return displayType;
}
