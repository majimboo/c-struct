// translate the given data into actual schema
// that the next function will understand

function Schema(obj) {
  // translate eveything in the factory
  this.factory(obj);
}

Schema.prototype.factory = function(obj) {
  this.tree = obj;
};

var schema = module.exports = exports = Schema;
