console.info('Loading module...');

const fs = require("fs");
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

console.log(bindings.add(1, 1));




