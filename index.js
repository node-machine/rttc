module.exports = {
  validate: require('./lib/validate'),
  validateStrict: require('./lib/validate-strict'),
  coerce: require('./lib/coerce'),
  infer: require('./lib/infer'),
  isEqual: require('./lib/is-equal'),
  getDisplayType: require('./lib/get-display-type'),
  sanitize: require('./lib/sanitize'),
  encode: require('./lib/encode'),
  decode: require('./lib/decode')
};
