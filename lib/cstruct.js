var events = require('events');
var util = require('util');
var Struct = require('./struct');

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

function CStruct() {
  // constants
  this.le = 'little';
  this.be = 'big';

  // struct pool
  this.structures = {};
}

util.inherits(CStruct, events.EventEmitter);
module.exports = new CStruct();

CStruct.prototype.def = function(name, structure, endian) {
  // default littleEndian
  endian = endian || this.le;

  // add to list
  this.structures[name] = structure;
};

CStruct.prototype.wrap = function(name, data) {
  var dcon = data.constructor;

  // catch unsupported types
  if (dcon !== Object && dcon !== Buffer && dcon !== Array)
    throw new Error('Unsupported type');

  var structure = this.structures[name];

  // make visible
  this[name] = new Struct(data, structure);
};

CStruct.prototype.u8 = function() {
  return {
    type: 'uint8',
    size: 1
  };
};

CStruct.prototype.u16 = function() {
  return {
    type: 'uint16',
    size: 2
  };
};

CStruct.prototype.u32 = function() {
  return {
    type: 'uint32',
    size: 4
  };
};

CStruct.prototype.string = function(size) {
  if (size === undefined) {
    throw new Error('CStrings are currently not supported. Please specify a length.');
    // cstring//null-terminated
    // return {
    //   type: 'cstring',
    //   size: 1
    // };
  } else {
    // padded string
    return {
      type: 'string',
      size: size || 1
    };
  }
};
