var types = module.exports = {};

types.string = function(size) {
  return size ? 'string:' + size : 'cstring';
};

types.boolean = 'boolean';
types.nibble = 'nibble';

types.uint8 = 'uint8';
types.u8 = function(def) {
  return types.uint8 + '-' + def;
};

types.uint16 = 'uint16';
types.u16 = function(def) {
  return types.uint16 + '-' + def;
};

types.uint24 = 'uint24';
types.u24 = function(def) {
  return types.uint24 + '-' + def;
};

types.uint32 = 'uint32';
types.u32 = function(def) {
  return types.uint32 + '-' + def;
};

types.uint40 = 'uint40';
types.u40 = function(def) {
  return types.uint40 + '-' + def;
};

types.uint48 = 'uint48';
types.u48 = function(def) {
  return types.uint48 + '-' + def;
};

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
