// protocol.js
const { Transform, Writable } = require('stream');
const protobuf = require('protobufjs');

// ±àÂëÆ÷
class ProtocolEncoder extends Transform {
  constructor(options) {
    super({ ...options, writableObjectMode: true });
    this.packetType = protobuf.loadSync("message.proto").lookupType("Packet");
  }

  _transform(packetObj, encoding, callback) {
    try {
      const errMsg = this.packetType.verify(packetObj);
      if (errMsg) throw Error(errMsg);

      const message = this.packetType.create(packetObj);
      const buffer = this.packetType.encode(message).finish();
      this.push(buffer);
      callback();
    } catch (err) {
      callback(err);
    }
  }
}

// ½âÂëÆ÷
class ProtocolDecoder extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.packetType = protobuf.loadSync("message.proto").lookupType("Packet");
  }

  _write(chunk, encoding, callback) {
    try {
      const decodedMessage = this.packetType.decode(chunk);
      const object = this.packetType.toObject(decodedMessage, {
        longs: String,
        enums: String,
        bytes: String,
      });
      this.emit('decoded', object);
      callback();
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = { ProtocolEncoder, ProtocolDecoder };