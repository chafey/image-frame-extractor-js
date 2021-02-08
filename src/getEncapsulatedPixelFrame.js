
/**
 * Function to deal with extracting an image frame from an encapsulated data set.
 */

export default function getEncapsulatedImageFrame(sopInstance, frameIndex, framesAreFragmented) {

    if(sopInstance.dataSet.PixelData.basicOffsetTable.length) {
        // Basic Offset Table is not empty
        return dicomParser.readEncapsulatedImageFrame(
            dataSet,
            dataSet.elements.x7fe00010,
            frameIndex
        );
        }
    }


  // Empty basic offset table

    if (framesAreFragmented) {
        const basicOffsetTable = dicomParser.createJPEGBasicOffsetTable(
        dataSet,
        dataSet.elements.x7fe00010
    );

    return dicomParser.readEncapsulatedImageFrame(
      dataSet,
      dataSet.elements.x7fe00010,
      frameIndex,
      basicOffsetTable
    );
  }

  return dicomParser.readEncapsulatedPixelDataFromFragments(
    dataSet,
    dataSet.elements.x7fe00010,
    frameIndex
  );
}
