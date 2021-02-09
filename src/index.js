const getEncapsulatedImageFrame = require('./getEncapsulatedPixelFrame');
const getUncompressedImageFrame = require('./getUncompressedImageFrame')
const getNumberOfFrames = require('./getNumberOfFrames')
const getHash = require('./getHash')
const decodeImageFrame = require('./decodeImageFrame')

const areFramesAreFragmented = (pixelData, numberOfFrames) => {
    return pixelData.encapsulatedPixelData && numberOfFrames != pixelData.fragments.length
}

const getFrameSize = (dataSet) => {
    return dataSet.Rows * 
        dataSet.Columns * 
        dataSet.SamplesPerPixel * 
        (dataSet.BitsAllocated / 8)
}

const imageFrameExtractor = async (sopInstance) => {

    // check to make sure this sopInstance has pixel data, bail if not
    const pixelData = sopInstance.dataSet.PixelData
    if(!pixelData) {
        return
    }

    // calculate nunber of frames
    const numberOfFrames = getNumberOfFrames(sopInstance)

    const framesAreFragmented = areFramesAreFragmented(pixelData, numberOfFrames)
    console.log('framesAreFragmented=', framesAreFragmented)

    const uncompressedFrameSize = getFrameSize(sopInstance.dataSet)

    for(let frame = 0; frame < numberOfFrames; frame++) {
        console.log('extracting frame ', frame)
        const imageFrame = await (async () => {
            if(pixelData.encapsulatedPixelData) {
                const compressedImageFrame = getEncapsulatedImageFrame(sopInstance.sourceInfo.uri, pixelData._fields, frame, framesAreFragmented)
                const result = await decodeImageFrame(sopInstance.dataSet, compressedImageFrame)
                return result.imageFrame
            } else {
                return getUncompressedImageFrame(sopInstance.sourceInfo.uri, pixelData, frame, uncompressedFrameSize)
            }
        })()
        console.log(imageFrame.length)
        const digest = getHash(imageFrame)
        console.log(digest)
        // TODO: encode

        // TODO: write encoded image frame to s3
    }
}

module.exports = imageFrameExtractor