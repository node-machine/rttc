/**
 * getNounPhrase()
 *
 * Given an RTTC "display type" string (and some options)
 * return an appropriate human-readable noun-phrase.
 * Useful for error messages, user interfaces, etc.
 *
 * @required  {String} type
 *         Recognizes any of the standard RTTC types:
 *           • string
 *           • number
 *           • boolean
 *           • lamda
 *           • dictionary
 *           • array
 *           • json
 *           • ref
 *
 * @return {String} [noun phrase]
 */
module.exports = function getNounPhrase(type){
  if (typeof type !== 'string') {
    throw new Error('Usage error: rttc.getNounPhrase() expects a string display type such as '+
    '`dictionary` or `ref`.  If you are trying to get the noun phrase for an exemplar, do '+
    '`rttc.getNounPhrase(rttc.inferDisplayType(exemplar))`. If you are trying to get a noun '+
    'phrase to represent voidness (i.e. null exemplar), then you should determine that on a '+
    'case-by-case basis-- there\'s no good sane default.');
  }

  if (type === 'string') {
    return 'A string.';
  }
  else if (type === 'number') {
    return 'A number.';
  }
  else if (type === 'boolean') {
    return 'A boolean.';
  }
  else if (type === 'lamda') {
    return 'A function.';
  }
  else if (type === 'dictionary') {
    return 'A dictionary.';
  }
  else if (type === 'array') {
    return 'An array.';
  }
  else if (type === 'json') {
    return 'A JSON-compatible value.';
    // might be a string, number, boolean, dictionary, array, or even null
  }
  else if (type === 'ref') {
    return 'A value of any type.';
  }
  else {
    throw new Error('Unknown type: `'+type+'`');
  }

};
