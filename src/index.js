const getEncapsulatedImageFrame = require('./getEncapsulatedPixelFrame');
const getUncompressedImageFrame = require('./getUncompressedImageFrame')
const getNumberOfFrames = require('./getNumberOfFrames')
const getHash = require('./getHash')
const decodeImageFrame = require('./decodeImageFrame')
const dicomCodec = require ('../extern/dicom-codec-js/src/index.js')
const fs = require('fs')

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
        const result = await (async () => {
            if(pixelData.encapsulatedPixelData) {
                const compressedImageFrame = getEncapsulatedImageFrame(sopInstance.sourceInfo.uri, pixelData._fields, frame, framesAreFragmented)
                const result = await decodeImageFrame(sopInstance.dataSet, compressedImageFrame)
                return result
            } else {
                const imageFrame = getUncompressedImageFrame(sopInstance.sourceInfo.uri, pixelData, frame, uncompressedFrameSize)
                return {
                    imageFrame,
                    imageInfo : {
                        columns: sopInstance.dataSet._fields.Columns.numberValue(),
                        rows: sopInstance.dataSet._fields.Rows.numberValue(),
                        bitsPerPixel: sopInstance.dataSet._fields.BitsAllocated.numberValue(),
                        signed: sopInstance.dataSet._fields.PixelRepresentation.numberValue() !== 0, 
                        componentsPerPixel: sopInstance.dataSet._fields.SamplesPerPixel.numberValue()
                    },
                    encodeOptions: {}
                }
            }
        })()
        const uncompressedDigest = getHash(result.imageFrame)
        console.log('uncompressed sha256 digest=', uncompressedDigest)
        // encode to htj2k
        const encodeOptions = {}
        console.time('encoding htj2k')
        const encodeResult = await dicomCodec.encode(result.imageFrame, 'htj2k', result.imageInfo, encodeOptions)
        console.timeEnd('encoding htj2k')
        const htj2kDigest = getHash(encodeResult.encodedImageFrame)
        console.log('htj2k sha256 digest=', htj2kDigest)
        // TODO: write encoded image frame to s3
        fs.writeFileSync('frame' + frame, encodeResult.encodedImageFrame)
    }
}

module.exports = imageFrameExtractor