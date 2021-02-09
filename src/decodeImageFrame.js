const dicomCodec = require ('../extern/dicom-codec-js/src/index.js')
  
const decodeImageFrame = async (dataSet, compressedImageFrame) => {
    //console.log(dataSet)
    const imageInfo = {
        columns: dataSet._fields.Columns.numberValue(),
        rows: dataSet._fields.Rows.numberValue(),
        bitsPerPixel: dataSet._fields.BitsAllocated.numberValue(),
        signed: dataSet._fields.PixelRepresentation.numberValue() !== 0, 
        componentsPerPixel: dataSet._fields.SamplesPerPixel.numberValue()
    }
    //console.log(imageInfo)
    console.time('decoding jpegls')
    const result = await dicomCodec.decode(compressedImageFrame, dataSet._fields.TransferSyntaxUID.stringValue(), imageInfo)
    console.timeEnd('decoding jpegls')
    return result
}

module.exports = decodeImageFrame