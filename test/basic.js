var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var _ = require('../');

describe('#c-struct', function () {
  it('should pack object to buffer with default values', function (done) {

    var playerSchema = new _.Schema({
      id: _.type.u16(5),
      name: _.type.string(16),
      hp: _.type.u24(5000),
      exp: _.type.u32(99999),
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

    // object to buffer
    var buf = _.packSync('Player', {
      name: 'Foobar',
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

    // buffer to object
    buf.toString('hex').should.equal('0500466f6f626172000000000000000000008813009f8601006477656c636f6d65007765656b6c7900017472617073206f66207468756e646572000000000000000000000000000000000fe20d3301020000000000000000000000000000000000000000000000000000000000000000000000000000666174616c20626c6f770000000000000000000000000000000000000000000000000000000367616c76616e6f20737472696b65000000000000000000000000000000000000000000000066005f01ffe0f5050000');
    buf.toString('hex').should.not.equal('0100466f6f62617200000000000000000000e8030038564c056477656c636f6d65007765656b6c7900017472617073206f66207468756e646572000000000000000000000000000000000fe20d3301020000000000000000000000000000000000000000000000000000000000000000000000000000666174616c20626c6f770000000000000000000000000000000000000000000000000000000367616c76616e6f20737472696b65000000000000000000000000000000000000000000000066005f01ffe0f5050000');
    done();
  });

  it ('uint16b', () => {
    const orig = 21;

    let data = _.packers['uint16l'](orig);
    let buf = Buffer.from(data);
    buf.toString('hex').should.equal('1500');

    data = _.packers['uint16b'](orig);
    buf = Buffer.from(data);
    buf.toString('hex').should.equal('0015');
    const actual = _.unpackers['uint16b']({ offset: 0 },buf);
    actual.should.equal(orig);
  });

  it ('uint32b', () => {
    const orig = 21;

    let data = _.packers['uint32l'](orig);
    let buf = Buffer.from(data);
    buf.toString('hex').should.equal('15000000');

    data = _.packers['uint32b'](orig);
    buf = Buffer.from(data);
    buf.toString('hex').should.equal('00000015');
    const actual = _.unpackers['uint32b']({ offset: 0 },buf);
    actual.should.equal(orig);
  });

  it('should unpack buffer to object', function (done) {

    var playerSchema = new _.Schema({
      id: _.type.uint16,
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

    // buffer to object
    var obj = _.unpackSync('Player', buf);

    obj.should.have.property('id', 1);
    obj.should.have.property('name', 'Foobar');
    obj.should.have.property('hp', 1000);
    obj.should.have.property('exp', 88888888);
    obj.should.have.property('status', 100);

    done();
  });

  it('should unpack array objects', function () {
    const schema = new _.Schema({
      type: _.type.string(4),
      version: _.type.uint8,
      id: _.type.string(16),
      count: _.type.uint8,
      collection: [{
        id: _.type.string(16),
        sequenceNumber: _.type.uint16
      }]
    });
    _.register('Schema', schema);

    let data = {
      type: 'abcd',
      version: 1,
      id: 'abcdabcdabcdabcd',
      count: 3,
      collection: [{
        id: 'efghefghefghefgh',
        sequenceNumber: 1,
      }, {
        id: 'hijkhijkhijkhijk',
        sequenceNumber: 2,
      }, {
        id: 'abcdefghijklmnop',
        sequenceNumber: 3,
      }]
    };
    const packedData = _.packSync('Schema', data);
    const unpackedData = _.unpackSync('Schema', packedData);
    expect(unpackedData).to.deep.equal(data);
  });
});
