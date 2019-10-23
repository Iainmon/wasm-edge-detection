"use strict";
exports.__esModule = true;
function flatten2DArray(array) {
    var flattenedArray = new Array();
    for (var x = 0; x < array.length; x++) {
        for (var y = 0; y < array[0].length; y++) {
            flattenedArray.push(array[x][y]);
        }
    }
    return flattenedArray;
}
module.exports.flatten2DArray = flatten2DArray;
function constructFlattenedArray(array, width, heigth) {
    var constructedArray = new Array();
    for (var y = 0; y < heigth; y++) {
        constructedArray.push(new Array());
    }
    for (var x = 0; x < heigth; x++) {
        for (var y = 0; y < width; y++) {
            constructedArray[x][y] = array[(width * x) + y];
        }
    }
    return constructedArray;
}
module.exports.constructFlattenedArray = constructFlattenedArray;
