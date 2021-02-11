const assert = require('assert')
const imageFrameExtractor = require('../src/index')
const fs = require('fs')
const path = require('path')
const ion = require("ion-js");
const util = require('util')

const loadIon = (path) => {
    const data = fs.readFileSync(path)
    return ion.load(data)
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

describe('index', async () => {

    before(async() => {
    })

    it('exports', async () => {
        // Arrange

        // Act

        // Assert
        assert.notStrictEqual(imageFrameExtractor, undefined)
    })

    it('exports', async () => {
        // Arrange
        //const sourcePath = 'test/fixtures/CT0012.not_fragmented_bot_jpeg_ls.80.ion'
        //const sourcePath = 'test/fixtures/CT0012.fragmented_no_bot_jpeg_ls.80.ion'
        const sourcePath = 'test/fixtures/anon-jpgls.ion'
        //const sourcePath = 'test/fixtures/CT1_UNC.ion'
        const sopInstance = loadIon(sourcePath)

        // Act
        await imageFrameExtractor(sopInstance, (encodeResult, frame) => {
            //console.log(encodeResult)
            fs.writeFileSync('frame' + frame, encodeResult.encodedImageFrame)
        })

        // Assert
        assert.notStrictEqual(ion, undefined)
    }).timeout(10000)


})
