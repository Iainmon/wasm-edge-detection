const Jimp = require('jimp');
const KernelIterator = require('./KernelItorator');

const greyscaleGrid = new Array();

Jimp.read('./images/flower.jpeg', function (err, image) {
    if (err) { return console.error(err); }

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    for (let x = 0; x < width; x++) {

        greyscaleGrid.push(new Array());

        for (let y = 0; y < height; y++) {
            let pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
            let average = (pixel.r + pixel.g + pixel.b) / 3;
            greyscaleGrid[x][y] = average;
        }
    }

    let kernelMultipliers = [
        // [2, 4, 6, 4, 2],
        // [4, 6, 8, 6, 4],
        // [6, 8, 10,8, 6],
        // [4, 6, 8, 6, 4],
        // [2, 4, 6, 4, 2]
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];

    let kernelIterator = new KernelIterator(greyscaleGrid, kernelMultipliers);

    let newGreyScaleGrid = kernelIterator.process();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let grey = Math.min(newGreyScaleGrid[x][y], 255);
            let hex = Jimp.rgbaToInt(grey, grey, grey, 255);
            image.setPixelColor(hex, x, y);
        }
    }
    
    image.write('blured.jpeg');

});

