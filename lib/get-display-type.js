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

  var typeSchema;
  try {
    typeSchema = infer(x);
  }
  catch (e) {}

  switch (typeSchema) {
    case 'ref':
      return 'mutable reference (===)';
    case 'lamda':
      return 'lambda function (->)';
    case 'json':
      return 'JSON-compatible value (*)';
    default:
      if (_.isEqual(infer(x), [])) {
        return 'generic array ([])';
      }
      if (_.isEqual(infer(x), {})) {
        return 'generic dictionary ({})';
      }
      if (_.isArray(infer(x))) {
        return 'array';
      }
      var displayType = typeof x;
      try {
        displayType = x.constructor.name;
        if (displayType.match(/object/i)) {
          return 'dictionary';
        }
      }
      catch (e){}
      return displayType;
  }

};
