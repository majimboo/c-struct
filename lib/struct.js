var routines = require('./routines');

function Struct(data, structure) {
  this.data = data;
  this.structure = structure;

  this.type = data.constructor;
}

module.exports = Struct;

Struct.prototype.toBuffer = function() {
  if (this.type === Buffer)
    throw new Error('Cannot convert to Buffer');

  var type, size;
  var binary = [];
  var len = 0;
  var data = this.data;

  for (var k in this.structure) {
    type = this.structure[k].type;
    size = this.structure[k].size;

    // d, l, s
    binary.push(routines[type + 'FromObject'](data[k], len, size));

    // done for this one
    len += size;
  }

  return new Buffer([].concat.apply([], binary));
};

Struct.prototype.toArray = function() {
  if (this.type === Buffer)
    return this.data.toJSON();

  return this.toBuffer().toJSON();
};

Struct.prototype.toObject = function() {
  if (this.type === Object)
    throw new Error('Cannot convert to Object');

  var type, size;
  var obj = Object.create(null);
  var len = 0;
  var data = this.data;

  for (var k in this.structure) {
    type = this.structure[k].type;
    size = this.structure[k].size;

    // d, l, s
    obj[k] = routines[type + 'FromBuffer'](data, len, size);

    // done for this one
    len += size;
  }

  return obj;
};
