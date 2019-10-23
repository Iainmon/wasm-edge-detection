declare type i32 = number;

export function flatten2DArray(array: Array<Array<i32>>): Array<i32> {
    let flattenedArray = new Array<i32>();

    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            flattenedArray.push(array[x][y]);
        }
    }

    return flattenedArray;
}
export function constructFlattenedArray(array: Array<i32>, width: i32, heigth: i32): Array<Array<i32>> {
    let constructedArray = new Array<Array<i32>>();

    for (let y = 0; y < heigth; y++) {
        constructedArray.push(new Array<i32>());
    }

    for (let x = 0; x < heigth; x++) {
        for (let y = 0; y < width; y++) {
            constructedArray[x][y] = array[(width * x) + y];
        }
    }

    return constructedArray;
}