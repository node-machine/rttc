/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var infer = require('./infer');


/**
 * private helper fn
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
module.exports = function getDisplayType(x){

  switch (infer(x)) {
    case 'ref':
      return 'mutable reference (===)';
    case 'lamda':
      return 'lambda fn (->)';
    case 'json':
      return '"* (JSON-compatible)"';
    default:
      var displayType = typeof x;
      try {
        displayType = x.constructor.name;
      }
      catch (e){}
      return displayType;
  }

};
