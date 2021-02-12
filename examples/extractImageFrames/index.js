const fs = require('fs');
const imageFrameExtractor = require('../../src')
const path = require('path');
const ion = require("ion-js");

const main = async () => {

    if(process.argv.length < 4) {
        console.error("Usage: extractImageFrames <source> <target>")
        console.error("extractImageFrames converts DICOMP10 image frames to DAGCOM Ion format")
        console.error("")
        console.error("  <source> = directory containing DAGCOM SOP Instance ION files")
        console.error("  <target> = directory that resulting Ion image frames will be written")
        process.exit(-1)
    }

    const loadIon = (path) => {
        const data = fs.readFileSync(path)
        return ion.load(data)
    }
    

    fs.readdirSync(process.argv[2]).forEach(async(file) => {
        // skip the text ion files
        if(file.endsWith('text.ion')) {
            return
        }
        const sopInstance = loadIon(path.join(process.argv[2], file))
        // patch sopInstance sourceInfo to be relative to where dagcom-test-data is here
        sopInstance.sourceInfo.uri = sopInstance.sourceInfo.uri.replace('dicom2ion-js', 'image-frame-extractor-js')
        try {
            await imageFrameExtractor(sopInstance, (encodeResult, frame) => {
                const framePath =path.join(process.argv[3], file + '-' + frame + '.htj2k')
                console.log('framePath=', framePath)
                fs.writeFileSync(framePath, encodeResult, {encoding:'binary'})
                process.stdout.write(".")
            })
        }
        catch(ex) {
            console.log(ex + file)
        }
    });
    console.log('done')
}

main()