/// <reference path="../node_modules/assemblyscript/index.d.ts" />

export const INT32ARRAY_ID = idof<Array<i32>>()

function flatten2DArray(array: Array<Array<i32>>): Array<i32> {
    let flattenedArray = new Array<i32>();

    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            flattenedArray.push(array[x][y]);
        }
    }

    return flattenedArray;
}
function constructFlattenedArray(array: Array<i32>, width: i32, heigth: i32): Array<Array<i32>> {
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

export function testArrayFlattener(array: Array<i32>, width: i32, heigth: i32): Array<i32> {
    return flatten2DArray(constructFlattenedArray(array, width, heigth));
}


export class Kernel {

    public size: i32;
    public margin: i32;

    public multipliers: Array<Array<i32>>;

    constructor(_multipliers: Array<i32>, width: i32) {
        let multipliers: Array<Array<i32>> = constructFlattenedArray(_multipliers, width, width);
        this.size = width;
        this.margin = Math.floor(this.size / 2) as i32;

        this.multipliers = new Array<Array<i32>>();
        for (let x: i32 = 0; x < this.size; x++) {
            this.multipliers.push(new Array<i32>());

            for (let y: i32 = 0; y < this.size; y++) {
                this.multipliers[x][y] = multipliers[x][y];
            }
        }
    }

    public iterate(flattenedGrid: Array<i32>, width: i32, heigth: i32): Array<i32> {

        let grid: Array<Array<i32>> = constructFlattenedArray(flattenedGrid, width, heigth);

        let newGrid: Array<Array<i32>> = new Array<Array<i32>>();

        for (let x: i32 = 0; x < grid.length; x++) {
            newGrid.push(new Array<i32>());
            for (let y: i32 = 0; y < grid[x].length; y++) {
                newGrid[x][y] = grid[x][y];
            }
        }

        for (let x = this.margin; x < grid.length - this.margin; x++) {
            for (let y = this.margin; y < grid[x].length - this.margin; y++) {

                let sum: i32 = 0;

                for (let i: i32 = 0; i < this.size; i++) {        
                    for (let j: i32 = 0; j < this.size; j++) {
                        sum += (grid[x + i - this.margin][y + j - this.margin] * this.multipliers[i][j]);
                    }
                }

                newGrid[x][y] = Math.round(sum / 9) as i32;

            }
        }

        flattenedGrid = flatten2DArray(newGrid);

        return flattenedGrid;
    }
}

export const KERNEL_CLASS_ID = idof<Kernel>()


class Kernel2D {

    public size: i32;
    public margin: i32;

    public multipliers: Array<Array<i32>>;

    constructor(multipliers: Array<Array<i32>>) {
        this.size = multipliers.length;
        this.margin = Math.floor(this.size / 2) as i32;

        this.multipliers = new Array<Array<i32>>();
        for (let x: i32 = 0; x < this.size; x++) {
            this.multipliers.push(new Array<i32>());

            for (let y: i32 = 0; y < this.size; y++) {
                this.multipliers[x][y] = multipliers[x][y];
            }
        }
    }

    public iterate(grid: Array<Array<i32>>): Array<Array<i32>> {

        let newGrid: Array<Array<i32>> = new Array<Array<i32>>();

        for (let x: i32 = 0; x < grid.length; x++) {
            newGrid.push(new Array<i32>());
            for (let y: i32 = 0; y < grid[x].length; y++) {
                newGrid[x][y] = grid[x][y];
            }
        }

        for (let x = this.margin; x < grid.length - this.margin; x++) {
            for (let y = this.margin; y < grid[x].length - this.margin; y++) {

                let sum: i32 = 0;

                for (let i: i32 = 0; i < this.size; i++) {        
                    for (let j: i32 = 0; j < this.size; j++) {
                        sum += (grid[x + i - this.margin][y + j - this.margin] * this.multipliers[i][j]);
                    }
                }

                newGrid[x][y] = Math.round(sum / 9) as i32;

            }
        }

        return newGrid;
    }
}

export function detectEdges(flattenedImage: Array<i32>, width: i32, heigth: i32): Array<i32> {
    let image = constructFlattenedArray(flattenedImage, width, heigth);

    let blurMultipliers = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ] as Array<Array<i32>>;

    let blurKernel = new Kernel2D(blurMultipliers);

    let bluredImage = blurKernel.iterate(image);
    image = bluredImage;

    let dxMultipliers = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ] as Array<Array<i32>>;
    
    let dyMultipliers = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ] as Array<Array<i32>>;

    let dxKernel = new Kernel2D(dxMultipliers);
    let dyKernel = new Kernel2D(dyMultipliers);

    let dx = dxKernel.iterate(image);
    let dy = dyKernel.iterate(image);

    for (let x: i32 = 0; x < dx.length; x++) {
        for (let y: i32 = 0; y < dx[x].length; y++) {
            image[x][y] = Math.sqrt(Math.pow(dx[x][y], 2) + Math.pow(dy[x][y], 2)) as i32;
        }
    }

    flattenedImage = flatten2DArray(image);
    return flattenedImage;
}