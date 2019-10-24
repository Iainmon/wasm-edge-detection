console.info('Loading module...');

const fs = require("fs");
const ArrayFlattener = require('./ArrayFlattener');
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/untouched.wasm"));
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
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

const flattenedKernelMultipliers = ArrayFlattener.flatten2DArray(kernelMultipliers);
const flattenedKernelMultipliersWidth = kernelMultipliers.length;

let kernelMultipliers_ptr = instance.__retain(instance.__allocArray(instance.INT32ARRAY_ID, flattenedKernelMultipliers));

console.log('\nInput:\n');
console.log(ArrayFlattener.constructFlattenedArray(instance.__getInt32Array(instance.testArrayFlattener(kernelMultipliers_ptr, 3, 3)), 3, 3));

let kernel = new instance.Kernel(kernelMultipliers_ptr, 3);

const kernelInput = [
    [1, 1, 1, 1, 1],
    [1, 5, 5, 5, 1],
    [1, 5, 5, 5, 1],
    [1, 5, 5, 5, 1],
    [1, 1, 1, 1, 1]
];

let flattenedKernelInput = ArrayFlattener.flatten2DArray(kernelInput);

let flattenedKernelInput_ptr = instance.__retain(instance.__allocArray(instance.INT32ARRAY_ID, flattenedKernelInput));

const kernelOutput_ptr = kernel.iterate(flattenedKernelInput_ptr, 5, 5);

const flattenedKernelOutput = instance.__getInt32Array(kernelOutput_ptr);

const kernelOutput = ArrayFlattener.constructFlattenedArray(flattenedKernelOutput, 5, 5);

console.log('\nOutput:\n');
console.log(kernelOutput);