const charls = require('charls-js')
charls.onRuntimeInitialized = async _ => {
    // Now you can use it
    console.log('charls initialized')
}

function decodeJPEGLS(jpeglsEncodedBitStream) {
    // Create a decoder instance
    const decoder = new charls.JpegLSDecoder();
    
    // get pointer to the source/encoded bit stream buffer in WASM memory
    // that can hold the encoded bitstream
    const encodedBufferInWASM = decoder.getEncodedBuffer(jpeglsEncodedBitStream.length);
    
    // copy the encoded bitstream into WASM memory buffer
    encodedBufferInWASM.set(jpeglsEncodedBitStream);
    
    // decode it
    decoder.decode();
    
    // get information about the decoded image
    const frameInfo = decoder.getFrameInfo();
    const interleaveMode = decoder.getInterleaveMode();
    const nearLossless = decoder.getNearLossless();
    
    // get the decoded pixels
    const decodedPixelsInWASM = decoder.getDecodedBuffer();

    const decodedPixelsInJS = decodedPixelsInWASM.slice()

    // TODO: do something with the decoded pixels here (e.g. display them)
    // The pixel arrangement for color images varies depending upon the
    // interleaveMode parameter, see documentation in JpegLSDecode::getInterleaveMode()
    
    // delete the instance.  Note that this frees up memory including the
    // encodedBufferInWASM and decodedPixelsInWASM invalidating them. 
    // Do not use either after calling delete!
    decoder.delete();

    return decodedPixelsInJS
}
  
const decodeImageFrame = (dataSet, compressedImageFrame) => {
    if(dataSet._fields.TransferSyntaxUID.stringValue() === '1.2.840.10008.1.2.4.80') {
        console.log('decoding jpegls')
        return decodeJPEGLS(compressedImageFrame)
    }
    console.log('dataSet._fields.TransferSyntaxUID=', dataSet._fields.TransferSyntaxUID)
}

module.exports = decodeImageFrame