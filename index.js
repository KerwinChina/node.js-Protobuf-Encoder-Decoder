const { ProtocolEncoder, ProtocolDecoder } = require('./protocol');
const { PassThrough } = require('stream');


const mockTransportStream = new PassThrough();

// 创建编码器和解码器实例
const encoder = new ProtocolEncoder();
const decoder = new ProtocolDecoder();

// 监听解码后的数据事件
decoder.on('decoded', (packet) => {
  console.log('Decoded packet:', packet);
});

// 将编码器连接到模拟传输流，然后将传输流连接到解码器
encoder.pipe(mockTransportStream).pipe(decoder);

// 模拟发送一个数据包
const packet = {
  packetType: 0, // REQUEST
  packetId: 123,
  data: Buffer.from(JSON.stringify({ message: 'Hello, world!' }))
};

encoder.write(packet);