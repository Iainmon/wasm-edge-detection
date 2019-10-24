const fs = require('fs');
const ArrayFlattener = require('./ArrayFlattener');
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + '/build/untouched.wasm'));
const loader = require('assemblyscript/lib/loader');

const imports = {
    env: {
        MY_CONST: 500,
        abort(_msg, _file, line, column) {
            console.error('abort called at index.ts:' + line + ':' + column);
        }
    },

};


class KernelIterator {
    constructor() {
        this.instance = loader.instantiateSync(compiled, imports);
    }

    iterate(inputGrid, multipliers) {

        let flattenedKernelMultipliers = ArrayFlattener.flatten2DArray(multipliers);
        let kernelMultipliers_ptr = this.instance.__retain(this.instance.__allocArray(this.instance.INT32ARRAY_ID, flattenedKernelMultipliers));

        let flattenedKernelInput = ArrayFlattener.flatten2DArray(inputGrid);
        let flattenedKernelInput_ptr = this.instance.__retain(this.instance.__allocArray(this.instance.INT32ARRAY_ID, flattenedKernelInput));

        let kernel = new this.instance.Kernel(kernelMultipliers_ptr, multipliers.length);

        let kernelOutput_ptr = kernel.iterate(flattenedKernelInput_ptr, inputGrid[0].length, inputGrid.length);
        let flattenedKernelOutput = this.instance.__getInt32Array(kernelOutput_ptr);
        let kernelOutput = ArrayFlattener.constructFlattenedArray(flattenedKernelOutput, inputGrid[0].length, inputGrid.length);

        return kernelOutput;

    }

    realloc() {
        this.instance = null;
    }

    static detectEdges(image) {

        let instance = loader.instantiateSync(compiled, imports);

        let flattenedKernelInput = ArrayFlattener.flatten2DArray(image);
        let flattenedKernelInput_ptr = instance.__retain(instance.__allocArray(instance.INT32ARRAY_ID, flattenedKernelInput));

        let kernelOutput_ptr = detectEdges(flattenedKernelInput_ptr, image[0].length, image.length);
        let flattenedKernelOutput = instance.__getInt32Array(kernelOutput_ptr);
        let kernelOutput = ArrayFlattener.constructFlattenedArray(flattenedKernelOutput, image[0].length, image.length);

        return kernelOutput;
    }
}

module.exports = KernelIterator;