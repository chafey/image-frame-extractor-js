const fs = require('fs')

const readUriByteRange = (uri, start, length) => {
    if(uri.startsWith('file')) {
        const path = uri.substr(uri.indexOf(':') + 1)
        const buffer = fs.readFileSync(path)
        const data = new Uint8Array(buffer.buffer, start, length)
        return data
    } 
    // TODO: HTTP Byte Range
}
module.exports = readUriByteRange