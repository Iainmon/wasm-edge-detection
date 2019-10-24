const KernelIterator = require('./KernelIterator');

let kernel = new KernelIterator();

let multipliers = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

let input = [
    [1, 1, 1, 1, 1],
    [1, 5, 5, 5, 1],
    [1, 5, 5, 5, 1],
    [1, 5, 5, 5, 1],
    [1, 1, 1, 1, 1]
];

let output = kernel.iterate(input, multipliers);

console.log(output);

kernel.realloc();