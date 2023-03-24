const uuid = require('uuid');

const generateUUID = () => {
    const r = uuid.v4();
    const buf = Buffer.from(r);
    const arr = [];
    for (var i = 0; i < buf.length - 1; i++) {
        arr.push(buf.readInt8(i));
    }
    return arr.join('');
}

module.exports = {
    generateUUID,
}