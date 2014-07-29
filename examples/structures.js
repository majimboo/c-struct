var _ = require('../');

var playerSchema = new _.Schema({
  id: _.type.u16(8),
  name: _.type.string(16),
  hp: _.type.uint24,
  exp: _.type.uint32,
  status: _.type.uint8,
  motd: _.type.string(), // null-terminated
  motw: _.type.string(), // null-terminated
  skills: [{
    id: _.type.uint8,
    name: _.type.string(32),
    secret: _.type.uint40
  }],
  position: {
    x: _.type.uint16,
    y: _.type.uint16
  },
  hash: _.type.uint48
});

// register
_.register('Player', playerSchema);
