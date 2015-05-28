var util = require('util');
var assert = require('assert');
var _  = require('lodash');
var rttc = require('../');

describe('.isStrictType()', function() {

  // TODO: test that this doesn't go nuts given circular objects
  // (they should never be circular because they are type schemas, but still, for everyone's sanity)

  it('should consider string strict', function() {
    assert(rttc.isStrictType('string'));
  });
  it('should consider number strict', function() {
    assert(rttc.isStrictType('string'));
  });
  it('should consider boolean strict', function() {
    assert(rttc.isStrictType('boolean'));
  });
  it('should consider lamda strict', function() {
    assert(rttc.isStrictType('lamda'));
  });
  it('should consider generic dictionary NOT STRICT', function() {
    assert(! rttc.isStrictType({}) );
  });
  it('should consider generic array NOT STRICT', function() {
    assert(! rttc.isStrictType([]) );
  });
  it('should consider patterned dictionaries strict', function() {
    assert(rttc.isStrictType({x: 'string'}) );
    assert(rttc.isStrictType({y:'number'}) );
    assert(rttc.isStrictType({z: 'boolean'}) );
    assert(rttc.isStrictType({l: 'lamda'}) );
    assert(rttc.isStrictType({foo:'string', bar: 'boolean', baz: 'number'}) );
    assert(rttc.isStrictType({x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
  });
  it('should consider patterned arrays strict', function() {
    assert(rttc.isStrictType(['string']) );
    assert(rttc.isStrictType(['number']) );
    assert(rttc.isStrictType(['boolean']) );
    assert(rttc.isStrictType(['lamda']) );
    assert(rttc.isStrictType([{foo:'string', bar: 'boolean', baz: 'number'}]) );
    assert(rttc.isStrictType([['string']]) );
    assert(rttc.isStrictType([['number']]) );
    assert(rttc.isStrictType([['boolean']]) );
    assert(rttc.isStrictType([['lamda']]) );
    assert(rttc.isStrictType([[{foo:'string', bar: 'boolean', baz: 'number'}]]) );
  });
  it('should consider json NOT STRICT', function() {
    assert(! rttc.isStrictType('json') );
  });
  it('should consider ref NOT STRICT', function() {
    assert(! rttc.isStrictType('ref') );
  });
  it('should consider faceted/patterned things with nested json,ref,[],and {} as strict by default', function (){
    assert(rttc.isStrictType({saltySurprise: 'json', x: 'string'}) );
    assert(rttc.isStrictType({saltySurprise: 'json', y:'number'}) );
    assert(rttc.isStrictType({saltySurprise: 'json', z: 'boolean'}) );
    assert(rttc.isStrictType({saltySurprise: 'json', l: 'lamda'}) );
    assert(rttc.isStrictType({saltySurprise: 'json', foo:'string', bar: 'boolean', baz: 'number'}) );
    assert(rttc.isStrictType({saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
    assert(rttc.isStrictType([{saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
    assert(rttc.isStrictType(['json']) );
    assert(rttc.isStrictType([['json']]) );
    assert(rttc.isStrictType({saltySurprise: 'ref', x: 'string'}) );
    assert(rttc.isStrictType({saltySurprise: 'ref', y:'number'}) );
    assert(rttc.isStrictType({saltySurprise: 'ref', z: 'boolean'}) );
    assert(rttc.isStrictType({saltySurprise: 'ref', l: 'lamda'}) );
    assert(rttc.isStrictType({saltySurprise: 'ref', foo:'string', bar: 'boolean', baz: 'number'}) );
    assert(rttc.isStrictType({saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
    assert(rttc.isStrictType([{saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
    assert(rttc.isStrictType(['ref']) );
    assert(rttc.isStrictType([['ref']]) );
    assert(rttc.isStrictType({saltySurprise: {}, x: 'string'}) );
    assert(rttc.isStrictType({saltySurprise: {}, y:'number'}) );
    assert(rttc.isStrictType({saltySurprise: {}, z: 'boolean'}) );
    assert(rttc.isStrictType({saltySurprise: {}, l: 'lamda'}) );
    assert(rttc.isStrictType({saltySurprise: {}, foo:'string', bar: 'boolean', baz: 'number'}) );
    assert(rttc.isStrictType({saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
    assert(rttc.isStrictType([{saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
    assert(rttc.isStrictType([{}]) );
    assert(rttc.isStrictType([[{}]]) );
    assert(rttc.isStrictType({saltySurprise: [], x: 'string'}) );
    assert(rttc.isStrictType({saltySurprise: [], y:'number'}) );
    assert(rttc.isStrictType({saltySurprise: [], z: 'boolean'}) );
    assert(rttc.isStrictType({saltySurprise: [], l: 'lamda'}) );
    assert(rttc.isStrictType({saltySurprise: [], foo:'string', bar: 'boolean', baz: 'number'}) );
    assert(rttc.isStrictType({saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
    assert(rttc.isStrictType([{saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
    assert(rttc.isStrictType([[]]) );
    assert(rttc.isStrictType([[[]]]) );
  });
  it('should consider faceted/patterned things with nested json,ref,[],and {} as NOT STRICT if recursive flag is set', function (){
    assert(! rttc.isStrictType({saltySurprise: 'json', x: 'string'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'json', y:'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'json', z: 'boolean'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'json', l: 'lamda'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'json', foo:'string', bar: 'boolean', baz: 'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
    assert(! rttc.isStrictType([{saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
    assert(! rttc.isStrictType(['json'], true) );
    assert(! rttc.isStrictType([['json']], true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', x: 'string'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', y:'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', z: 'boolean'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', l: 'lamda'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', foo:'string', bar: 'boolean', baz: 'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
    assert(! rttc.isStrictType([{saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
    assert(! rttc.isStrictType(['ref'], true) );
    assert(! rttc.isStrictType([['ref']], true) );
    assert(! rttc.isStrictType({saltySurprise: {}, x: 'string'}, true) );
    assert(! rttc.isStrictType({saltySurprise: {}, y:'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: {}, z: 'boolean'}, true) );
    assert(! rttc.isStrictType({saltySurprise: {}, l: 'lamda'}, true) );
    assert(! rttc.isStrictType({saltySurprise: {}, foo:'string', bar: 'boolean', baz: 'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
    assert(! rttc.isStrictType([{saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
    assert(! rttc.isStrictType([{}], true) );
    assert(! rttc.isStrictType([[{}]], true) );
    assert(! rttc.isStrictType({saltySurprise: [], x: 'string'}, true) );
    assert(! rttc.isStrictType({saltySurprise: [], y:'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: [], z: 'boolean'}, true) );
    assert(! rttc.isStrictType({saltySurprise: [], l: 'lamda'}, true) );
    assert(! rttc.isStrictType({saltySurprise: [], foo:'string', bar: 'boolean', baz: 'number'}, true) );
    assert(! rttc.isStrictType({saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
    assert(! rttc.isStrictType([{saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
    assert(! rttc.isStrictType([[]], true) );
    assert(! rttc.isStrictType([[[]]], true) );
  });

});

