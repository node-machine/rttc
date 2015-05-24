/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');


/**
 * private helper fn
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
module.exports = function getDisplayType(x){
  var displayType;
  if (x === '===') {
    return 'mutable reference (===)';
  }
  if (x === '->') {
    return 'lambda fn (->)';
  }
  if (x === '*') {
    return '"* (JSON-compatible)"';
  }
  displayType = typeof x;
  try {
    displayType = x.constructor.name;
  }
  catch (e){}
  return displayType;
};
