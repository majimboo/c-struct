c-struct [![Build Status](https://travis-ci.org/majimboo/c-struct.svg?branch=master)](https://travis-ci.org/majimboo/c-struct)
========

[![NPM](https://nodei.co/npm/c-struct.png?downloads=true)](https://nodei.co/npm/c-struct/)

a binary data packing &amp; unpacking library for node.js

Installation
----

    npm install c-struct --save

Usage
----

**Buffer to Object**

    var _ = require('c-struct');

    _.def('user', {
      id: _.u32(),
      username: _.string(16),
      status: _.u8(),
      code: _.u16()
    });

    _.wrap('user', new Buffer('0500000065676869700000000000000000000000010200', 'hex'));

    _.user.toObject();
    #=> { id: 5, username: 'eghip', status: 1, code: 2 }


**Object to Buffer**

    var _ = require('c-struct');

    _.def('user', {
      id: _.u32(),
      username: _.string(16),
      status: _.u8(),
      code: _.u16()
    });

    _.wrap('user', {
      id: 6,
      username: 'majidemo',
      status: 1,
      code: 5000
    });

    _.user.toBuffer();
    #=> < Buffer 06 00 00 00 6d 61 6a 69 64 65 6d 6f 00 00 00 00 00 00 00 00 01 88 13 >

Configurations
----

> There is currently no configs.

**Byte Order**
(default: little endian)

**Supported Data Types**

- uint8
- uint16
- uint32
- string

TODO
----

- add configurable endianness
- add cstring packing and unpacking
- add signed 8, 16, 32
- add u/int24, u/int40
- add benchmark
- more testing

