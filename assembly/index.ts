/// <reference path="../node_modules/assemblyscript/index.d.ts" />

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

export class Kernel {

    public size: i32;
    public margin: i32;

    public multipliers: Array<Array<i32>>;

    public products: Array<Array<i32>>;

    constructor(multipliers: Array<Array<i32>>) {
        this.size = multipliers.length;
        this.margin = Math.floor(this.size / 2) as i32;

        this.multipliers = new Array<Array<i32>>();
        this.products = new Array<Array<i32>>();
        for (let x: i32 = 0; x < this.size; x++) {
            this.multipliers.push(new Array<i32>());
            this.products.push(new Array<i32>());

            for (let y: i32 = 0; y < this.size; y++) {
                this.multipliers[x][y] = multipliers[x][y];
                this.products[x][y] = 0;
            }
        }
    }

    public getAverage(): i32 {

        let sum: i32 = 0;

        for (let x: i32 = 0; x < this.size; x++) {
            for (let y: i32 = 0; y < this.size; y++) {
                sum += this.products[x][y];
            }
        }

        return Math.round(sum / this.size) as i32;
    }

    public iterate(grid: Array<Array<i32>>): Array<Array<i32>> {

        let newGrid: Array<Array<i32>> = new Array<Array<i32>>();

        for (let x = this.margin; x < grid.length - this.margin; x++) {

            newGrid.push(new Array<i32>());

            for (let y = this.margin; y < grid[x].length - this.margin; y++) {

                for (let i: i32 = 0; i < this.size; i++) {        
                    for (let j: i32 = 0; j < this.size; j++) {
                        this.products[i][j] = grid[x + i - this.margin][y + j - this.margin] * this.multipliers[x][y];
                    }
                }

                newGrid[x][y] = this.getAverage();

            }
        }

        return newGrid;
    }
}