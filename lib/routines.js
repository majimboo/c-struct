module.exports = R = {};

/**
 * stringFromBuffer
 * @param  {Buffer} d Data
 * @param  {Number} l length
 * @param  {Number} s Size
 * @return {Binary}   ByteArray
 */
R.stringFromBuffer = function(d, l, s) {
  var string = '';
  var eos = false;

  for (var i = 0; i < s; i++) {
    var byte = d[l + i];
    if (byte === 0) eos = true;

    if (!eos) string += String.fromCharCode(byte);
  }

  return string;
};

/**
 * stringFromObject
 * @param  {Object} d Data
 * @param  {Number} l length
 * @param  {Number} s Size
 * @return {Binary}   ByteArray
 */
R.stringFromObject = function(d, l, s) {
  var binary = [];

  for (var i = 0; i < s; i++) {
    binary.push(d.charCodeAt(i) || 0);
  }

  return binary;
};

/**
 * cstringFromBuffer
 * @param  {Buffer} d Data
 * @param  {Number} l length
 * @param  {Number} s Size
 * @return {Binary}   ByteArray
 */
R.cstringFromBuffer = function(d, l, s) {
  var o = 0;
  var string = '';

  for (var i = 0; i < d.length; i++) {
    var byte = d[l + i];
    if (byte === 0) o++;
    if (o === l && byte !== 0) string += String.fromCharCode(byte);
  }

  return string;
};

/**
 * cstringFromObject
 * @param  {Object} d Data
 * @param  {Number} l length
 * @param  {Number} s Size
 * @return {Binary}   ByteArray
 */
R.cstringFromObject = function(d, l, s) {

};


/**
 * [uint8FromBuffer description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint8FromBuffer = function(d, l, s) {
  return d[l + 0];
};

/**
 * [uint8FromObject description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint8FromObject = function(d, l, s) {
  return d & 0xFF;
};

/**
 * [uint16FromBuffer description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint16FromBuffer = function(d, l, s) {
  var binary = d[l + 0];
  binary |= d[l + 1] << 8;
  binary >>>= 0;
  return binary;
};

/**
 * [uint16FromObject description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint16FromObject = function(d, l, s) {
  var binary = [];
  binary[0] = d & 0xff;
  binary[1] = (d >> 8) & 0xff;
  return binary;
};

/**
 * [uint32FromBuffer description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint32FromBuffer = function(d, l, s) {
  var binary = d[0];
  binary |= d[1] << 8;
  binary |= d[2] << 16;
  binary |= d[3] << 24;
  binary >>>= 0;
  return binary;
};

/**
 * [uint32FromObject description]
 * @param  {[type]} d [description]
 * @param  {[type]} l [description]
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
R.uint32FromObject = function(d, l, s) {
  var binary = [];
  binary[0] = d & 0xFF;
  binary[1] = (d >> 8) & 0xFF;
  binary[2] = (d >> 16) & 0xFF;
  binary[3] = (d >> 24) & 0xFF;
  return binary;
};
