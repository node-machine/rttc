var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');

describe.only('.exemplar()', function() {


  it('should generate correct exemplars', function() {

    // Top-level
    assert.equal(rttc.exemplar('string'), 'a string');
    assert.equal(rttc.exemplar('number'), 123);
    assert.equal(rttc.exemplar('boolean'), true);
    assert(_.isEqual(rttc.exemplar({}), {}));
    assert(_.isEqual(rttc.exemplar([]), []));
    assert.equal(rttc.exemplar('json'), '*');
    assert.equal(rttc.exemplar('lamda'), '->');
    assert.equal(rttc.exemplar('ref'), '===');

    // Facted dictionary
    assert(_.isEqual(rttc.exemplar({x: 'string'}), {x:'a string'}));
    assert(_.isEqual(rttc.exemplar({x:'number'}), {x:123}));
    assert(_.isEqual(rttc.exemplar({x:'boolean'}), {x:true}));
    assert(_.isEqual(rttc.exemplar({x:{}}), {x:{}}));
    assert(_.isEqual(rttc.exemplar({x:[]}), {x:[]}));
    assert(_.isEqual(rttc.exemplar({x:'json'}), {x:'*'}));
    assert(_.isEqual(rttc.exemplar({x:'lamda'}), {x:'->'}));
    assert(_.isEqual(rttc.exemplar({x:'ref'}), {x:'==='}));

    // Patterned array
    assert(_.isEqual(rttc.exemplar(['string']), ['a string']));
    assert(_.isEqual(rttc.exemplar(['number']), [123]));
    assert(_.isEqual(rttc.exemplar(['boolean']), [true]));
    assert(_.isEqual(rttc.exemplar([{}]), [{}]));
    assert(_.isEqual(rttc.exemplar([[]]), [[]]));
    assert(_.isEqual(rttc.exemplar(['json']), ['*']));
    assert(_.isEqual(rttc.exemplar(['lamda']), ['->']));
    assert(_.isEqual(rttc.exemplar(['ref']), ['===']));

    // Patterned array in faceted dictionary
    assert(_.isEqual(rttc.exemplar({x:['string']}), {x:['a string']}));
    assert(_.isEqual(rttc.exemplar({x:['number']}), {x:[123]}));
    assert(_.isEqual(rttc.exemplar({x:['boolean']}), {x:[true]}));
    assert(_.isEqual(rttc.exemplar({x:[{}]}), {x:[{}]}));
    assert(_.isEqual(rttc.exemplar({x:[[]]}), {x:[[]]}));
    assert(_.isEqual(rttc.exemplar({x:['json']}), {x:['*']}));
    assert(_.isEqual(rttc.exemplar({x:['lamda']}), {x:['->']}));
    assert(_.isEqual(rttc.exemplar({x:['ref']}), {x:['===']}));

    // Faceted dictionary in patterned array
    assert(_.isEqual(rttc.exemplar([{x: 'string'}]), [{x:'a string'}]));
    assert(_.isEqual(rttc.exemplar([{x:'number'}]), [{x:123}]));
    assert(_.isEqual(rttc.exemplar([{x:'boolean'}]), [{x:true}]));
    assert(_.isEqual(rttc.exemplar([{x:{}}]), [{x:{}}]));
    assert(_.isEqual(rttc.exemplar([{x:[]}]), [{x:[]}]));
    assert(_.isEqual(rttc.exemplar([{x:'json'}]), [{x:'*'}]));
    assert(_.isEqual(rttc.exemplar([{x:'lamda'}]), [{x:'->'}]));
    assert(_.isEqual(rttc.exemplar([{x:'ref'}]), [{x:'==='}]));

  });

});

