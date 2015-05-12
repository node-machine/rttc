/**
 * Module dependencies
 */

var _ = require('lodash');



/**
 * Basic type definitions.
 *
 * Roughly based on https://github.com/bishopZ/Typecast.js
 * ________________________________________________________________________________
 * @type {Object}
 */

var type = {







  //              $$\               $$\
  //              $$ |              \__|
  //   $$$$$$$\ $$$$$$\    $$$$$$\  $$\ $$$$$$$\   $$$$$$\
  //  $$  _____|\_$$  _|  $$  __$$\ $$ |$$  __$$\ $$  __$$\
  //  \$$$$$$\    $$ |    $$ |  \__|$$ |$$ |  $$ |$$ /  $$ |
  //   \____$$\   $$ |$$\ $$ |      $$ |$$ |  $$ |$$ |  $$ |
  //  $$$$$$$  |  \$$$$  |$$ |      $$ |$$ |  $$ |\$$$$$$$ |
  //  \_______/    \____/ \__|      \__|\__|  \__| \____$$ |
  //                                              $$\   $$ |
  //                                              \$$$$$$  |
  //                                               \______/
  string: {
    is: _.isString,
    to: function(v) {

      if(_.isString(v)) return v;

      // Convert date into zone-independent (UTC) ISO-8601 timestamp
      if(_.isDate(v)) {
        return v.toJSON();
      }

      if (_.isUndefined(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Function) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Object) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Array) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === -Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNaN(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNull(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      return String(v);
    },
    getBase: function (){
      return '';
    }
  },





  //                                    $$\
  //                                    $$ |
  //  $$$$$$$\  $$\   $$\ $$$$$$\$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\
  //  $$  __$$\ $$ |  $$ |$$  _$$  _$$\ $$  __$$\ $$  __$$\ $$  __$$\
  //  $$ |  $$ |$$ |  $$ |$$ / $$ / $$ |$$ |  $$ |$$$$$$$$ |$$ |  \__|
  //  $$ |  $$ |$$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$   ____|$$ |
  //  $$ |  $$ |\$$$$$$  |$$ | $$ | $$ |$$$$$$$  |\$$$$$$$\ $$ |
  //  \__|  \__| \______/ \__| \__| \__|\_______/  \_______|\__|
  //
  //
  //
  number: {
    is: function(v) {
      return _.isNumber(v) && !_.isNaN(parseFloat(v)) && v!==Infinity && v!==-Infinity;
    },
    to: function(v) {

      // Check for Infinity and NaN
      if (v === Infinity || v === -Infinity) throw new Error('E_runtimeInputTypeCoercionError');
      if (_.isNaN(v)) throw new Error('E_runtimeInputTypeCoercionError');
      if (_.isNull(v)) throw new Error('E_runtimeInputTypeCoercionError');
      if (_.isUndefined(v)) throw new Error('E_runtimeInputTypeCoercionError');
      if (_.isObject(v)) throw new Error('E_runtimeInputTypeCoercionError');

      if(type.number.is(v)) return v;
      if(type.boolean.is(v)) return v ? 1 : 0;
      if(type.string.is(v)) {

        // Is this a string that appears to be a number?
        var isStringThatAppearsToBeNumber = (function _getIsStringThatAppearsToBeNumber(value){
          if (!_.isString(value)) return false;

          // (this is an exception... apparently doing `+''` in javascript results in `0`)
          if (value === '') return false;

          // General case:
          if ( _.isNaN(+value) ) return false;
          if ( +value=== Infinity ) return false;
          if ( +value=== -Infinity ) return false;

          return true;
        })(v);

        if (!isStringThatAppearsToBeNumber) {
          throw new Error('E_runtimeInputTypeCoercionError');
        }

        // Check for Infinity
        if (v === 'Infinity' || v === '-Infinity') {
          throw new Error('E_runtimeInputTypeCoercionError');
        }

        return +v;
      }

      var num = v * 1;
      if(!_.isNumber(num)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return (num === 0 && !v.match(/^0+$/)) ? 0 : num;
    },
    getBase: function (){
      return 0;
    }
  },






  //  $$\                           $$\
  //  $$ |                          $$ |
  //  $$$$$$$\   $$$$$$\   $$$$$$\  $$ | $$$$$$\   $$$$$$\  $$$$$$$\
  //  $$  __$$\ $$  __$$\ $$  __$$\ $$ |$$  __$$\  \____$$\ $$  __$$\
  //  $$ |  $$ |$$ /  $$ |$$ /  $$ |$$ |$$$$$$$$ | $$$$$$$ |$$ |  $$ |
  //  $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$   ____|$$  __$$ |$$ |  $$ |
  //  $$$$$$$  |\$$$$$$  |\$$$$$$  |$$ |\$$$$$$$\ \$$$$$$$ |$$ |  $$ |
  //  \_______/  \______/  \______/ \__| \_______| \_______|\__|  \__|
  //
  //
  //
  boolean: {
    is: _.isBoolean,
    to: function(v) {
      if(_.isBoolean(v)) return v;
      if (_.isNumber(v)){
        if(v === 1) return true;
        if(v === 0) return false;
      }
      if (_.isString(v)) {
        if(v === 'true') return true;
        if(v === 'false') return false;
        if(v === '1') return true;
        if(v === '0') return false;
      }

      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return false;
    }
  },







  //        $$\ $$\             $$\     $$\
  //        $$ |\__|            $$ |    \__|
  //   $$$$$$$ |$$\  $$$$$$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\
  //  $$  __$$ |$$ |$$  _____|\_$$  _|  $$ |$$  __$$\ $$  __$$\  \____$$\ $$  __$$\ $$ |  $$ |
  //  $$ /  $$ |$$ |$$ /        $$ |    $$ |$$ /  $$ |$$ |  $$ | $$$$$$$ |$$ |  \__|$$ |  $$ |
  //  $$ |  $$ |$$ |$$ |        $$ |$$\ $$ |$$ |  $$ |$$ |  $$ |$$  __$$ |$$ |      $$ |  $$ |
  //  \$$$$$$$ |$$ |\$$$$$$$\   \$$$$  |$$ |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |      \$$$$$$$ |
  //   \_______|\__| \_______|   \____/ \__| \______/ \__|  \__| \_______|\__|       \____$$ |
  //                                                                                $$\   $$ |
  //                                                                                \$$$$$$  |
  //                                                                                 \______/
  dictionary: {
    is: function(v) {
      if (!_.isObject(v)) return false;
      if (type.arr.is(v)) return false;
      if (!_.isPlainObject(v)) return false;
      return true;
    },
    to: function(v) {

      // Don't tolerate non-objects, or arrays, or regexps, or dates.
      if (!_.isObject(v) || _.isArray(v) || _.isDate(v) || _.isRegExp(v) || _.isError(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Plain objects are ok, but we'll clone them.
      // (TODO: this should be configurable)
      // Also this might not be necessary
      if (_.isPlainObject(v)){
        return _.clone(v);
      }

      // If this is NOT a "plain object" (i.e. some kind of prototypal thing)
      // determine whether it's JSON-compatible and if so, coerce it to that.
      // try {
      //   return JSON.parse(JSON.stringify(v));
      // }
      // catch (e) {}

      // If that doesn't work, give up
      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return {};
    }
  },





  //
  //
  //   $$$$$$\   $$$$$$\   $$$$$$\  $$$$$$\  $$\   $$\
  //   \____$$\ $$  __$$\ $$  __$$\ \____$$\ $$ |  $$ |
  //   $$$$$$$ |$$ |  \__|$$ |  \__|$$$$$$$ |$$ |  $$ |
  //  $$  __$$ |$$ |      $$ |     $$  __$$ |$$ |  $$ |
  //  \$$$$$$$ |$$ |      $$ |     \$$$$$$$ |\$$$$$$$ |
  //   \_______|\__|      \__|      \_______| \____$$ |
  //                                         $$\   $$ |
  //                                         \$$$$$$  |
  //                                          \______/
  array: {
    is: _.isArray,
    to: function(v) {
      if (!_.isArray(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return v;
    },
    getBase: function (){
      return [];
    }
  },




  //                   $$$\                                $$\     $$\       $$\                     $$$\
  //   $$\$$\         $$  _|                               $$ |    $$ |      \__|                     \$$\
  //   \$$$  |       $$  /  $$$$$$\  $$$$$$$\  $$\   $$\ $$$$$$\   $$$$$$$\  $$\ $$$$$$$\   $$$$$$\    \$$\
  //  $$$$$$$\       $$ |   \____$$\ $$  __$$\ $$ |  $$ |\_$$  _|  $$  __$$\ $$ |$$  __$$\ $$  __$$\    $$ |
  //  \_$$$ __|      $$ |   $$$$$$$ |$$ |  $$ |$$ |  $$ |  $$ |    $$ |  $$ |$$ |$$ |  $$ |$$ /  $$ |   $$ |
  //   $$ $$\        \$$\  $$  __$$ |$$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |  $$  |
  //   \__\__|        \$$$\\$$$$$$$ |$$ |  $$ |\$$$$$$$ |  \$$$$  |$$ |  $$ |$$ |$$ |  $$ |\$$$$$$$ |$$$  /
  //                   \___|\_______|\__|  \__| \____$$ |   \____/ \__|  \__|\__|\__|  \__| \____$$ |\___/
  //                                           $$\   $$ |                                  $$\   $$ |
  //                                           \$$$$$$  |                                  \$$$$$$  |
  //                                            \______/                                    \______/
  '*': {
    is: function(v) {
      return !_.isUndefined(v);
    },
    to: function(v) {

      if(_.isUndefined(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      return v;
    },
    getBase: function (){
      return undefined;
    }
  },


};






// Aliases
type.str = type.email = type.url = type.string;
type.bool = type.boolean;
type.arr = type.array;
type.integer = type.int;
type.float = type.number;
type.object = type.obj = type.dictionary;

module.exports = type;



