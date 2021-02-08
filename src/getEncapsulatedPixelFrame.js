
const readUriByteRange = require('./readUriByteRange')

const findFragmentIndexWithOffset = (fragments, offset) => {
    const fragmentElements = fragments.elements()
    for (let i = 0; i < fragmentElements.length; i++) {
        const fragmentElement = fragmentElements[i]._fields
        if (fragmentElement.offset.numberValue() === offset) {
        return i;
      }
    }
  };
  
 /**
 * Function to deal with extracting an image frame from an encapsulated data set.
 */

const getEncapsulatedImageFrame = (uri, pixelData, frameIndex, framesAreFragmented) => {

    // BOT present
    if(pixelData.basicOffsetTable && pixelData.basicOffsetTable.length) {
        const start = pixelData.basicOffsetTable[frameIndex]
        const startFragmentIndex = findFragmentIndexWithOffset(pixelData.fragments, start.numberValue());
        const fragment = pixelData.fragments[startFragmentIndex]
        return readUriByteRange(uri, fragment.position, fragment.length)
    }

    // No BOT
    if(framesAreFragmented) {
        // TODO: defragment the frame
    } else {
        const fragment = pixelData.fragments[frameIndex]
        return readUriByteRange(uri, fragment.position, fragment.length)
    }
    

}

module.exports = getEncapsulatedImageFrame