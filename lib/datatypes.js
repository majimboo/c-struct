var types = module.exports = {};

types.string = function(size) {
  return size ? 'string:' + size : 'cstring';
};

types.boolean = 'boolean';
types.nibble = 'nibble';

types.uint8 = 'uint8';
types.uint16 = 'uint16';
types.uint24 = 'uint24';
types.uint32 = 'uint32';
types.uint40 = 'uint40';
types.uint48 = 'uint48';

types.int8 = 'int8';
types.int16 = 'int16';
types.int24 = 'int24';
types.int32 = 'int32';
types.int40 = 'int40';
types.int48 = 'int48';

types.double = 'double';
types.float = 'float';

types.le = 'l';
types.be = 'b';
