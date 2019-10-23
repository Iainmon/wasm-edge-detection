console.info('Loading module...');

const fs = require("fs");
const ArrayFlattener = require('./ArrayFlattener');
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/optimized.wasm"));
const loader = require("assemblyscript/lib/loader");

const imports = {
    env: {
        MY_CONST: 500,
        abort(_msg, _file, line, column) {
            console.error("abort called at index.ts:" + line + ":" + column);
        }
    },

};
const instance = loader.instantiateSync(compiled, imports);

console.info('Module loaded!\n');

const kernelMultipliers = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
];

const flattenedKernelMultipliers = ArrayFlattener.flatten2DArray(kernelMultipliers);
const flattenedKernelMultipliersWidth = kernelMultipliers.length;

console.log('got here');
let kernelMultipliers_ptr = instance.__retain(instance.__allocArray(instance.INT32ARRAY_ID, flattenedKernelMultipliers));
let kernel = new instance.Kernel(kernelMultipliers_ptr, 3);

const kernelInput = [
    [1, 1, 1, 1, 1, 100, 100, 100, 100],
    [1, 1, 1, 1, 1, 100, 100, 100, 100],
    [1, 1, 1, 1, 1, 100, 100, 100, 100],
    [1, 1, 1, 1, 1, 100, 100, 100, 100],
    [1, 1, 1, 1, 1, 100, 100, 100, 100]
];

let flattenedKernelInput = ArrayFlattener.flatten2DArray(kernelInput);

let flattenedKernelInput_ptr = instance.__retain(instance.__allocArray(instance.INT32ARRAY_ID, flattenedKernelInput));

console.log('got here 2');
kernel.iterate(flattenedKernelInput_ptr, kernelInput[0].length, kernelInput.length)
const kernelOutput = ArrayFlattener.constructFlattenedArray(instance.__getInt32Array(flattenedKernelInput_ptr), kernelInput[0].length, kernelInput.length);

console.log(kernelOutput);