// Format | C Type         | JavaScript Type   | Size (octets) | Notes
// -------------------------------------------------------------------
//    A   | char[]         | Array             |     Length     |  (1)
//    x   | pad byte       | N/A               |        1       |
//    c   | char           | string (length 1) |        1       |  (2)
//    b   | signed char    | number            |        1       |  (3)
//    B   | unsigned char  | number            |        1       |  (3)
//    h   | signed short   | number            |        2       |  (3)
//    H   | unsigned short | number            |        2       |  (3)
//    i   | signed long    | number            |        4       |  (3)
//    I   | unsigned long  | number            |        4       |  (3)
//    l   | signed long    | number            |        4       |  (3)
//    L   | unsigned long  | number            |        4       |  (3)
//    s   | char[]         | string            |     Length     |  (2)
//    f   | float          | number            |        4       |  (4)
//    d   | double         | number            |        8       |  (5)

var Schema = require('./schema');
var DataTypes = require('./datatypes');

var cstruct = module.exports = {};

/**
 * Private
 */
var schemas = {};

/**
 * [register description]
 * @param  {[type]} name   [description]
 * @param  {[type]} schema [description]
 * @return {[type]}        [description]
 *
 * @api public
 */
cstruct.register = function(name, schema) {
  // cache schema
  schemas[name] = schema;

  return schemas[name];
};

/**
 * [unpackSync description]
 * @param  {[type]} name    [description]
 * @param  {[type]} buffer  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 *
 * @api public
 */
cstruct.unpackSync = function(name, buffer, options) {
  options = options || {};
  var byteord = options.endian || DataTypes.le;
  var schema = schemas[name].tree;

  function next(pointer, buf, scheme) {
    var res = {};

    if (arguments.length === 2) {
      scheme = buf;
      buf = pointer;
      pointer = {
        offset: 0
      };
    }

    for (var el in scheme) {

      var s = scheme[el];
      if (typeof s === 'string') {
        // string
        if (s.indexOf('string') > -1) {
          var xstr = s.split(':');
          res[el] = unpacker[xstr[0]](pointer, buf, parseInt(xstr[1]));
        }
        // number
        else {
          if (s.indexOf('-') > -1) {
            var xnum = s.split('-');
            res[el] = unpacker[xnum[0] + byteord](pointer, buf);
          } else {
            res[el] = unpacker[s + byteord](pointer, buf);
          }
        }
      } else if (Array.isArray(s)) {
        res[el] = list(pointer, buf, s[0]);
      } else {
        res[el] = next(pointer, buf, s);
      }
    }

    return res;
  }

  function list(pointer, buf, scheme) {
    var len = buf.length;
    var arlen = 0;
    var res = [];

    for (var el in scheme) {
      var s = scheme[el];
      if (s === 'uint8') {
        arlen += 1;
      }
      if (s === 'uint16') {
        arlen += 2;
      }
      if (s === 'uint32') {
        arlen += 4;
      }
      if (s.indexOf('string') > -1) {
        arlen += parseInt(s.split(':')[1]);
      }
    }

    var m = pointer.offset + arlen;
    var count = 0;

    while (m < len) {
      m += arlen;
      count++;
    }

    while (count--) {
      res.push(next(pointer, buf, scheme));
    }

    return res;
  }

  return next(buffer, schema);
};

/**
 * [packSync description]
 * @param  {[type]} name    [description]
 * @param  {[type]} object  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 *
 * @api public
 */
cstruct.packSync = function(name, object, options) {
  options = options || {};
  var byteord = options.endian || DataTypes.le;
  var schema = schemas[name].tree;

  function next(obj, scheme) {
    var binary = [];

    for (var el in scheme) {
      var s = scheme[el];
      if (typeof s === 'string') {
        // string
        if (s.indexOf('string') > -1) {
          var xstr = s.split(':');
          binary.push(packer[xstr[0]](obj[el], parseInt(xstr[1])));
        }
        // number
        else {
          if (s.indexOf('-') > -1) {
            var xnum = s.split('-');
            binary.push(packer[xnum[0] + byteord](obj[el] || xnum[1]));
          } else {
            binary.push(packer[s + byteord](obj[el]));
          }
        }
      } else if (Array.isArray(s)) {
        binary.push(list(obj[el], s[0]));
      } else {
        binary.push(next(obj[el], s));
      }
    }

    return [].concat.apply([], binary);
  }

  function list(val, scheme) {
    if (!Array.isArray(val))
      throw Error('Value is not array.');

    var res = [];
    var len = val.length;

    for (var i = 0; i < len; i++) {
      res.push(next(val[i], scheme));
    }

    return [].concat.apply([], res);
  }

  return new Buffer(next(object, schema));
};

/**
 * Expose
 *
 * @api public
 */
cstruct.Schema = Schema;
cstruct.type = DataTypes;

/**
 * Packer Routines
 *
 * @api private
 */
var packer = {};

packer.string = function(val, sz) {
  var binary = [];

  for (var i = 0; i < sz; i++) {
    // hakish
    try {
      binary.push(val.charCodeAt(i) || 0);
    } catch (ex) {
      binary.push(0);
    }
  }

  return binary;
};

packer.cstring = function(val, sz) {
  var binary = [];

  for (var i = 0; i < val.length; i++) {
    binary.push(val.charCodeAt(i));
  }

  // append null-byte
  binary.push(0x00);

  return binary;
};

packer.boolean = function(val) {
  throw new Error('Not Yet Impelemented');
};

packer.nibble = function(val) {
  throw new Error('Not Yet Impelemented');
};

packer.uint8l = function(val) {
  return val & 0xFF;
};

packer.uint16l = function(val) {
  var binary = [];
  binary[0] = val & 0xff;
  binary[1] = (val >> 8) & 0xff;
  return binary;
};

packer.uint24l = function(val) {
  var binary = [];
  binary[0] = val & 0xFF;
  binary[1] = (val >> 8) & 0xFF;
  binary[2] = (val >> 16) & 0xFF;
  return binary;
};

packer.uint32l = function(val) {
  var binary = [];
  binary[0] = val & 0xFF;
  binary[1] = (val >> 8) & 0xFF;
  binary[2] = (val >> 16) & 0xFF;
  binary[3] = (val >> 24) & 0xFF;
  return binary;
};

packer.uint40l = function(val) {
  var binary = [];
  binary[0] = val & 0xFF;
  binary[1] = (val >> 8) & 0xFF;
  binary[2] = (val >> 16) & 0xFF;
  binary[3] = (val >> 24) & 0xFF;
  binary[4] = (val / 0x100000000) & 0xFF;
  return binary;
};

packer.uint48l = function(val) {
  var binary = [];
  binary[0] = val & 0xFF;
  binary[1] = (val >> 8) & 0xFF;
  binary[2] = (val >> 16) & 0xFF;
  binary[3] = (val >> 24) & 0xFF;
  binary[4] = (val / 0x100000000) & 0xFF;
  binary[5] = (val / 0x10000000000) & 0xFF;
  return binary;
};

/**
 * Unpacker Routines
 *
 * @api private
 */
var unpacker = {};

unpacker.string = function(pointer, buffer, sz) {
  var string = '';
  var eos = false;

  for (var i = 0; i < sz; i++) {
    var byte = buffer[pointer.offset++];
    if (byte === 0) eos = true;

    if (!eos) string += String.fromCharCode(byte);
  }

  return string;
};

unpacker.cstring = function(pointer, buffer, sz) {
  var string = '';

  // first byte of null-term string
  var byte = buffer[pointer.offset];

  while (byte > 0) {
    string += String.fromCharCode(byte);
    byte = buffer[++pointer.offset];
  }

  pointer.offset++;

  return string;
};

unpacker.boolean = function(pointer, buffer) {
  throw new Error('Not Yet Impelemented');
};

unpacker.nibble = function(pointer, buffer) {
  throw new Error('Not Yet Impelemented');
};

unpacker.uint8l = function(pointer, buffer) {
  return buffer[pointer.offset++];
};

unpacker.uint16l = function(pointer, buffer) {
  var binary = buffer[pointer.offset++];
  binary |= buffer[pointer.offset++] << 8;
  binary >>>= 0;
  return binary;
};

unpacker.uint24l = function(pointer, buffer) {
  var binary = buffer[pointer.offset++];
  binary |= buffer[pointer.offset++] << 8;
  binary |= buffer[pointer.offset++] << 16;
  binary >>>= 0;
  return binary;
};

unpacker.uint32l = function(pointer, buffer) {
  var binary = buffer[pointer.offset++];
  binary |= buffer[pointer.offset++] << 8;
  binary |= buffer[pointer.offset++] << 16;
  binary |= buffer[pointer.offset++] << 24;
  binary >>>= 0;
  return binary;
};

unpacker.uint40l = function(pointer, buffer) {
  var binary = buffer[pointer.offset++];
  binary |= buffer[pointer.offset++] << 8;
  binary |= buffer[pointer.offset++] << 16;
  binary |= buffer[pointer.offset++] << 24;
  binary >>>= 0;
  binary += buffer[pointer.offset++] * 0x100000000;
  return binary;
};

unpacker.uint48l = function(pointer, buffer) {
  var binary = buffer[pointer.offset++];
  binary |= buffer[pointer.offset++] << 8;
  binary |= buffer[pointer.offset++] << 16;
  binary |= buffer[pointer.offset++] << 24;
  binary >>>= 0;
  binary += buffer[pointer.offset++] * 0x100000000;
  binary += buffer[pointer.offset++] * 0x10000000000;
  return binary;
};
