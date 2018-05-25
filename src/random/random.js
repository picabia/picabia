const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const bytes = [];
for (let ix = 0; ix < 256; ix++) {
  bytes[ix] = (ix < 16 ? '0' : '') + (ix).toString(16);
}

const string = (len) => {
  let str = '';
  for (let ix = 0; ix < len; ix++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

const id = () => string(6);

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 */
const uuid = () => {
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = Math.random() * 0xffffffff | 0;
  return bytes[d0 & 0xff] + bytes[d0 >> 8 & 0xff] + bytes[d0 >> 16 & 0xff] + bytes[d0 >> 24 & 0xff] + '-' + bytes[d1 & 0xff] + bytes[d1 >> 8 & 0xff] + '-' + bytes[d1 >> 16 & 0x0f | 0x40] + bytes[d1 >> 24 & 0xff] + '-' + bytes[d2 & 0x3f | 0x80] + bytes[d2 >> 8 & 0xff] + '-' + bytes[d2 >> 16 & 0xff] + bytes[d2 >> 24 & 0xff] + bytes[d3 & 0xff] + bytes[d3 >> 8 & 0xff] + bytes[d3 >> 16 & 0xff] + bytes[d3 >> 24 & 0xff];
};

function shuffle (array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const Random = {
  string,
  id,
  uuid,
  shuffle
};

export {
  Random
};
