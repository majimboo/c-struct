var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('../');

describe('#c-struct', function() {
  it('should convert buffer to object', function(done) {

    _.def('login', {
      username: _.string(16),
      password: _.string(16),
      unk1: _.string(16)
    }, _.le);

    _.wrap('login', new Buffer('6d616a696400000000000000000000006172696600000000000000000000000000000000000000000000000000000000', 'hex'));

    expect(_.login.toObject()).to.have.property('username', 'majid');
    expect(_.login.toObject()).to.have.property('password', 'arif');

    done();
  });

  it('should convert object to buffer', function(done) {

    _.def('login', {
      username: _.string(16),
      password: _.string(16),
      unk1: _.string(16)
    }, _.le);

    _.wrap('login', {
      username: 'majid',
      password: 'arif',
      unk1: ''
    });

    expect(_.login.toBuffer()).to.be.instanceof(Buffer);
    expect(_.login.toBuffer().toString('hex')).to.equal('6d616a696400000000000000000000006172696600000000000000000000000000000000000000000000000000000000');

    done();
  });

  it('should convert buffer to byte array', function(done) {

    _.def('login', {
      username: _.string(16),
      password: _.string(16),
      unk1: _.string(16)
    }, _.le);

    _.wrap('login', new Buffer('6d616a696400000000000000000000006172696600000000000000000000000000000000000000000000000000000000', 'hex'));

    _.login.toArray();

    done();
  });

  it('should convert object to byte array', function(done) {

    _.def('login', {
      username: _.string(16),
      password: _.string(16),
      unk1: _.string(16)
    }, _.le);

    _.wrap('login', {
      username: 'majid',
      password: 'arif',
      unk1: ''
    });

    _.login.toArray();

    done();
  });

});



describe('#uint8', function() {

  it('should support uint8 to object', function(done) {

    _.def('size', {
      size: _.u8()
    }, _.le);

    _.wrap('size', new Buffer('0A', 'hex'));

    expect(_.size.toObject().size).to.equal(10);

    done();
  });

  it('should support uint8 to buffer', function(done) {

    _.def('size', {
      size: _.u8()
    }, _.le);

    _.wrap('size', {
      size: 11
    });

    expect(_.size.toBuffer().toString('hex')).to.equal('0b');

    done();
  });

});



describe('#uint16', function() {

  it('should support uint16 to object', function(done) {

    _.def('user', {
      id: _.u16()
    }, _.le);

    _.wrap('user', new Buffer('01000000', 'hex'));

    expect(_.user.toObject().id).to.equal(1);

    done();
  });

  it('should support uint16 to buffer', function(done) {

    _.def('user', {
      id: _.u16()
    }, _.le);

    _.wrap('user', {
      id: 1
    });

    expect(_.user.toBuffer().toString('hex')).to.equal('0100');

    done();
  });

});



describe('#uint32', function() {

  it('should support uint32 to object', function(done) {

    _.def('notSoLong', {
      id: _.u32()
    }, _.le);

    _.wrap('notSoLong', new Buffer('010000000000', 'hex'));

    expect(_.notSoLong.toObject().id).to.equal(1);

    done();
  });

  it('should support uint32 to buffer', function(done) {

    _.def('notSoLong', {
      id: _.u32()
    }, _.le);

    _.wrap('notSoLong', {
      id: 1
    });

    expect(_.notSoLong.toBuffer().toString('hex')).to.equal('01000000');

    done();
  });

});



describe('#string', function() {

  it('should support string to object', function(done) {

    _.def('name', {
      name: _.string(5)
    }, _.le);

    _.wrap('name', new Buffer('6567686970', 'hex'));

    expect(_.name.toObject().name).to.equal('eghip');

    done();
  });

  it('should support string to buffer', function(done) {

    _.def('name', {
      name: _.string(5)
    }, _.le);

    _.wrap('name', {
      name: 'eghip'
    });

    expect(_.name.toBuffer().toString('hex')).to.equal('6567686970');

    done();
  });

});



// describe('#cstring', function() {

//   it('should support cstring to object', function(done) {

//     _.def('person', {
//       firstName: _.string(),
//       lastName: _.string()
//     }, _.le);

//     _.wrap('person', new Buffer('65676869700065676869707000', 'hex'));

//     // expect(_.person.toObject().firstName).to.equal('eghip');
//     console.log(_.person.toObject());

//     done();
//   });

//   it('should support cstring to buffer', function(done) {

//     _.def('person', {
//       firstName: _.string(),
//       lastName: _.string()
//     }, _.le);

//     _.wrap('person', {
//       firstName: 'eghip',
//       lastName: 'eghip'
//     });

//     // expect(_.person.toBuffer().toString('hex')).to.equal('6567686970');
//     console.log(_.person.toBuffer());

//     done();
//   });

// });



describe('#mixed', function() {

  it('should work as expected with to object', function(done) {

    _.def('user', {
      id: _.u32(),
      username: _.string(16),
      status: _.u8(),
      code: _.u16()
    }, _.le);

    _.wrap('user', new Buffer('0500000065676869700000000000000000000000010200', 'hex'));

    expect(_.user.toObject().id).to.equal(5);
    expect(_.user.toObject().username).to.equal('eghip');
    expect(_.user.toObject().status).to.equal(1);
    expect(_.user.toObject().code).to.equal(2);

    console.log(_.user.toObject());

    done();
  });

  it('should work as expected with to buffer', function(done) {

    _.def('user', {
      id: _.u32(),
      username: _.string(16),
      status: _.u8(),
      code: _.u16()
    }, _.le);

    _.wrap('user', {
      id: 6,
      username: 'majidemo',
      status: 1,
      code: 5000
    });

    expect(_.user.toBuffer().toString('hex')).to.equal('060000006d616a6964656d6f0000000000000000018813');

    done();
  });

});



describe('#complicated', function() {

  it('should handle complicated buffer to object', function(done) {
    _.def('complicated', {

    }, _.le);

    done();
  });

});



describe('#extra', function() {
  it('should show list of all defined structures', function(done) {
    // console.log(_.structures);
    done();
  });
});
