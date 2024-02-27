const { ProtocolEncoder, ProtocolDecoder } = require('./protocol');
const { PassThrough } = require('stream');


const mockTransportStream = new PassThrough();

// �����������ͽ�����ʵ��
const encoder = new ProtocolEncoder();
const decoder = new ProtocolDecoder();

// ���������������¼�
decoder.on('decoded', (packet) => {
  console.log('Decoded packet:', packet);
});

// �����������ӵ�ģ�⴫������Ȼ�󽫴��������ӵ�������
encoder.pipe(mockTransportStream).pipe(decoder);

// ģ�ⷢ��һ�����ݰ�
const packet = {
  packetType: 0, // REQUEST
  packetId: 123,
  data: Buffer.from(JSON.stringify({ message: 'Hello, world!' }))
};

encoder.write(packet);