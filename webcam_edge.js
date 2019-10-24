const ColorSpace = require('color-space');
const Jimp = require('jimp');
const KernelIterator = require('./KernelIterator');
const cam = require('./capture');

console.log('Capturing image...');
let processImage = (err, data) => {

    if (err) { return console.error(err); }

    let greyscaleGrid = new Array();

    console.log('Reading image...');

    Jimp.read('./' + data, function (err, image) {
        if (err) { return console.error(err); }

        // Gets image dimenstion
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Reads the image file into memory
        for (let x = 0; x < width; x++) {

            greyscaleGrid.push(new Array());

            for (let y = 0; y < height; y++) {
                let pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
                let average = (pixel.r + pixel.g + pixel.b) / 3;
                greyscaleGrid[x][y] = average;
            }
        }

        /*
         *  Preprocesses image. (makes it blury)
         */

        console.log('Preprocessing image...');

        let blurKernelMultipliers = [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ];

        let blurKernelIterator = new KernelIterator();

        let bluredGreyscaleGrid = blurKernelIterator.iterate(greyscaleGrid, blurKernelMultipliers);
        blurKernelIterator.realloc();

        for (let x = 0; x < bluredGreyscaleGrid.length; x++) {
            for (let y = 0; y < bluredGreyscaleGrid[0].length; y++) {
                let grey = Math.min(bluredGreyscaleGrid[x][y], 255);
                greyscaleGrid[x][y] = grey;
            }
        }


        /*
         *  Edge detection
         */

        console.log('Calculating edges...');

        let kernelMultipliersX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        let kernelMultipliersY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];

        let kernelIteratorX = new KernelIterator();
        let kernelIteratorY = new KernelIterator();

        let greyscaleX = kernelIteratorX.iterate(greyscaleGrid, kernelMultipliersX);
        let greyscaleY = kernelIteratorY.iterate(greyscaleGrid, kernelMultipliersY);

        kernelIteratorX.realloc();
        kernelIteratorY.realloc();

        let newGreyScaleGrid = greyscaleGrid;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                newGreyScaleGrid[x][y] = Math.sqrt(Math.pow(greyscaleX[x][y], 2) + Math.pow(greyscaleY[x][y], 2));
            }
        }

        // Greyscale only
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let grey = Math.min(newGreyScaleGrid[x][y], 255);
                let hex = Jimp.rgbaToInt(grey, grey, grey, 255);
                image.setPixelColor(hex, x, y);
            }
        }

        /*
         *  Color processing
         */

        // console.log('Calculating edge orientations...');

        // let angleEdgeColors = new Array();

        // for (let x = 0; x < width; x++) {

        //     angleEdgeColors.push(new Array());

        //     for (let y = 0; y < height; y++) {

        //         let orientation = Math.atan(greyscaleY[x][y] / greyscaleX[x][y]) * (180 / Math.PI);
        //         orientation = isNaN(orientation) ? 0 : orientation;
        //         let rgb = ColorSpace.hsl.rgb([orientation, 100, 50]);
        //         angleEdgeColors[x][y] = { r: rgb[0] / 255, g: rgb[1] / 255, b: rgb[2] / 255 };

        //     }
        // }

        // for (let x = 0; x < width; x++) {
        //     for (let y = 0; y < height; y++) {
        //         let grey = Math.min(newGreyScaleGrid[x][y], 255);
        //         let color = angleEdgeColors[x][y];
        //         let hex = Jimp.rgbaToInt(color.r * grey, color.g * grey, color.b * grey, 255);
        //         image.setPixelColor(hex, x, y);
        //     }
        // }


        console.log('Saving image...');
        image.write('webcam_image_edges.jpeg');

        setTimeout(function () {cam.capture('webcam_image', processImage);}, 10);

    });


};

setTimeout(function () {cam.capture('webcam_image', processImage);}, 10);
