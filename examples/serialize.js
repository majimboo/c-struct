var _ = require('../');

// object to buffer
var buf = _.packSync('Player', {
  id: 1,
  name: 'Foobar',
  hp: 1000,
  exp: 88888888,
  status: 100,
  skills: [{
    id: 1,
    name: 'traps of thunder',
    secret: 5151515151
  }, {
    id: 2,
  }, {
    name: 'fatal blow'
  }, {
    id: 3,
    name: 'galvano strike'
  }],
  position: {
    x: 102,
    y: 351
  },
  motd: 'welcome',
  motw: 'weekly',
  hash: 99999999,
});

console.log('------- serializing -------');
console.log(buf);
