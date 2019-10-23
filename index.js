console.info('Loading module...');

const fs = require("fs");
const ArrayFlattener = require('./ArrayFlattener');
const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/optimized.wasm"));
const imports = {
    env: {
        MY_CONST: 500,
        abort(_msg, _file, line, column) {
            console.error("abort called at index.ts:" + line + ":" + column);
        }
    },

};
Object.defineProperty(module, "exports", {
    get: () => new WebAssembly.Instance(compiled, imports).exports
});

console.info('Module loaded!\n');

const bindings = module.exports;


const kernelMultipliers = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
];

const flattenedKernelMultipliers = ArrayFlattener.flatten2DArray(kernelMultipliers);
const flattenedKernelMultipliersWidth = kernelMultipliers.length;

let ptr = module.__retain(module.__allocArray(module.INT32ARRAY, flattenedKernelMultipliers));

let kernel = new module.exports.Kernel(ptr);
console.log(kernel.getAverage());




