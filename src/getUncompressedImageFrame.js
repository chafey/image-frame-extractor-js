const readUriByteRange = require('./readUriByteRange')

function getUncompressedImageFrame(uri,pixelData, frame, uncompressedFrameSize) {
    const start = pixelData.dataOffset + frame * uncompressedFrameSize
    const length = uncompressedFrameSize
    return readUriByteRange(uri, start, length)
}

module.exports = getUncompressedImageFrame;
