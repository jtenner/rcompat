import BufferView from "#BufferView";
import test from "@rcompat/test";

type Asserter = Parameters<Parameters<typeof test.case>[1]>[0];

const byteCompare = (assert: Asserter, buffer: Uint8Array, bytes: ArrayLike<number>) => {
  assert(buffer.length === bytes.length).true();
  for (let i = 0; i < buffer.length; i++) {
    assert(buffer[i] === bytes[i]).true();
  }
}

test.case("i8", assert => {
  const view = new BufferView(new ArrayBuffer(3))
    .writeI8(-1)
    .writeI8(2)
    .writeI8(100);
  byteCompare(assert, view.toBytes(), [
    255,
    2,
    100,
  ]);

  view.position = 1;
  const byte = view.readI8();

  assert(
    byte === 2 && view.position === 2,
  ).true();
});


test.case("u8", assert => {
  const view = new BufferView(new ArrayBuffer(3))
    .writeU8(255)
    .writeU8(2)
    .writeU8(100);
  byteCompare(assert, view.toBytes(), [
    255,
    2,
    100,
  ]);

  view.position = 1;
  const byte = view.readU8();

  assert(
    byte === 2 && view.position === 2,
  ).true();
});

test.case("i16", assert => {
  const view = new BufferView(new ArrayBuffer(4))
    .writeI16(0x1234)
    .writeI16(0x5678);
  
  byteCompare(assert, view.toBytes(), [
    0x34,
    0x12,
    0x78,
    0x56,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI16(0x1234).writeI16(0x5678);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
  ]);

  view.position = 2;
  view.littleEndian = true;
  view.writeI16(0x1234);

  view.position = 2;
  view.littleEndian = false;
  const byte = view.readI16();

  assert(byte === 0x3412 && view.position === 4).true();
});


test.case("u16", assert => {
  const view = new BufferView(new ArrayBuffer(4))
    .writeU16(0x1234)
    .writeU16(0x5678);
  
  byteCompare(assert, view.toBytes(), [
    0x34,
    0x12,
    0x78,
    0x56,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI16(0x1234).writeI16(0x5678);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
  ]);

  view.position = 2;
  view.littleEndian = true;
  view.writeU16(0x1234);

  view.position = 2;
  view.littleEndian = false;
  const byte = view.readU16();

  assert(byte === 0x3412 && view.position === 4).true();
});

test.case("i32", assert => {
  const view = new BufferView(new ArrayBuffer(8))
    .writeI32(0x12345678)
    .writeI32(0x9ABCDEF0);
  
  byteCompare(assert, view.toBytes(), [
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI32(0x12345678).writeI32(0x9ABCDEF0);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
  ]);

  view.position = 4;
  view.littleEndian = true;
  view.writeI32(0x12345678);

  view.position = 4;
  view.littleEndian = false;
  const byte = view.readI32();

  assert(byte === 0x78563412 && view.position === 8).true();
});

test.case("u32", assert => {
  const view = new BufferView(new ArrayBuffer(8))
    .writeU32(0x12345678)
    .writeU32(0x9ABCDEF0);
  
  byteCompare(assert, view.toBytes(), [
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeU32(0x12345678).writeU32(0x9ABCDEF0);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
  ]);

  view.position = 4;
  view.littleEndian = true;
  view.writeU32(0x12345678);

  view.position = 4;
  view.littleEndian = false;
  const byte = view.readU32();

  assert(byte === 0x78563412 && view.position === 8).true();
});

test.case("i64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeI64(0x123456789ABCDEF0n)
    .writeI64(0x123456789ABCDEF0n);
  
  byteCompare(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readI64();

  assert(byte === -0xf21436587a9cbeen && view.position === 16).true();
});


test.case("u64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeU64(0x123456789ABCDEF0n)
    .writeU64(0x123456789ABCDEF0n);
  
  byteCompare(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const value = view.readI64();

  assert(value === -0xf21436587a9cbeen && view.position === 16).true();

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readI64();

  assert(byte === -0xf21436587a9cbeen && view.position === 16).true();
});


test.case("u64", assert => {
  const view = new BufferView(new ArrayBuffer(16))
    .writeU64(0x123456789ABCDEF0n)
    .writeU64(0x123456789ABCDEF0n);
  
  byteCompare(assert, view.toBytes(), [
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 0;
  view.littleEndian = false;
  view.writeI64(0x123456789ABCDEF0n);

  byteCompare(assert, view.toBytes(), [
    0x12,
    0x34,
    0x56,
    0x78,
    0x9A,
    0xBC,
    0xDE,
    0xF0,
    0xF0,
    0xDE,
    0xBC,
    0x9A,
    0x78,
    0x56,
    0x34,
    0x12,
  ]);

  view.position = 8;
  view.littleEndian = true;
  view.writeI64(0x123456789ABCDEF0n);

  view.position = 8;
  view.littleEndian = false;
  const byte = view.readU64();

  assert(byte === 0xF0DEBC9A78563412n && view.position === 16).true()
});


test.case("string", assert => {
  const helloWorld = new TextEncoder().encode("Hello World");
  const view = new BufferView(new ArrayBuffer(helloWorld.length))
    .write("Hello World");
  
  byteCompare(assert, view.toBytes(), helloWorld);

  view.position = 0;
  const string = view.read(helloWorld.length);

  assert(string === "Hello World" && view.position === helloWorld.length).true();
});

test.case("bytes", assert => {
  const bytes = [1, 2, 3];
  const expected = new Uint8Array(bytes);
  const view = new BufferView(new ArrayBuffer(bytes.length));

  view.writeBytes(expected);

  byteCompare(assert, view.toBytes(), bytes);

  view.position = 0;
  const read = view.readBytes(bytes.length);

  assert(read.length === bytes.length && view.position === bytes.length).true();
  
});