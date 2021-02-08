//const { default: getEncapsulatedImageFrame } = require('./getEncapsulatedPixelFrame');
const getUncompressedImageFrame = require('./getUncompressedImageFrame')
const getNumberOfFrames = require('./getNumberOfFrames')
const getHash = require('./getHash')
const areFramesAreFragmented = (pixelData, numberOfFrames) => {
    return pixelData.encapsulatedPixelData && numberOfFrames != pixelData.fragments.length
}

const getFrameSize = (dataSet) => {
    return dataSet.Rows * 
        dataSet.Columns * 
        dataSet.SamplesPerPixel * 
        (dataSet.BitsAllocated / 8)
}

const imageFrameExtractor = (sopInstance) => {

    // check to make sure this sopInstance has pixel data, bail if not
    const pixelData = sopInstance.dataSet.PixelData
    if(!pixelData) {
        return
    }

    // calculate nunber of frames
    const numberOfFrames = getNumberOfFrames(sopInstance)

    const framesAreFragmented = areFramesAreFragmented(pixelData, numberOfFrames)

    const uncompressedFrameSize = getFrameSize(sopInstance.dataSet)

    for(let frame = 0; frame < numberOfFrames; frame++) {
        console.log('extracting frame ', frame)
        const imageFrame = (() => {
            if(pixelData.encapsulatedPixelData) {
                //return getEncapsulatedImageFrame(sopInstance.sourceInfo.uri, pixelData, frame, framesAreFragmented)
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