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

    let kernelMultipliersX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    let kernelMultipliersY = [
        [-1, -2, -1],
        [0,   0,  0],
        [1,   2,  1]
    ];

    let kernelIteratorX = new KernelIterator(greyscaleGrid, kernelMultipliersX);
    let kernelIteratorY = new KernelIterator(greyscaleGrid, kernelMultipliersY);
    
    let greyscaleX = kernelIteratorX.process();
    let greyscaleY = kernelIteratorY.process();

    let newGreyScaleGrid = greyscaleGrid;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            newGreyScaleGrid[x][y] = Math.sqrt(Math.pow(greyscaleX[x][y], 2) + Math.pow(greyscaleY[x][y], 2));
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let grey = Math.min(newGreyScaleGrid[x][y], 255);
            let hex = Jimp.rgbaToInt(grey, grey, grey, 255);
            image.setPixelColor(hex, x, y);
        }
    }
    
    image.write('edge.jpeg');

});

