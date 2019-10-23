class KernelIterator {
    constructor(array, kernelMultipliers) {
        this.array = array;
        this.kernelMultipliers = kernelMultipliers;
    }

    process() {

        let arrayBuffer = this.getArrayBuffer();

        let margin = this.getKernelMargins(this.kernelMultipliers);

        for (let x = margin; x < this.array.length - margin; x++) {
            for (let y = margin; y < this.array[0].length - margin; y++) {

                let kernelBuffer = this.getKernelBuffer();

                for (let i = 0; i < kernelBuffer.length; i++) {        
                    for (let j = 0; j < kernelBuffer[0].length; j++) {
                        kernelBuffer[i][j] *= this.array[x + i - margin][y + j - margin];
                    }
                }

                arrayBuffer[x][y] = this.averageOfKernelBuffer(kernelBuffer);

                //console.log(this.array[x][y] - arrayBuffer[x][y]);
            }
        }

        return arrayBuffer;
    }

    getKernelBuffer() {
        let kernelBuffer = new Array();

        for (let x = 0; x < this.kernelMultipliers.length; x++) {
            
            kernelBuffer.push(new Array());

            for (let y = 0; y < this.kernelMultipliers[0].length; y++) {
                kernelBuffer[x][y] = this.kernelMultipliers[x][y];
            }
        }

        return kernelBuffer;
    }

    getKernelMargins(kernel) {
        return Math.floor(kernel.length/2);
    }

    getArrayBuffer() {
        var buffer = new Array();

        this.array.forEach( () => buffer.push(new Array()));
        
        for (let x = 0; x < this.array.length; x++) {
            for (let y = 0; y < this.array[0].length; y++) {
                buffer[x][y] = 0;//this.array[x][y];
            }
        }
        return buffer;
    }

    averageOfKernelBuffer(kernel) {
        let kernelCount = kernel.length * kernel[0].length;

        let sum = 0;

        for (let x = 0; x < kernel.length; x++) {
            for (let y = 0; y < kernel[0].length; y++) {
                sum += kernel[x][y];
            }
        }

        return Math.round(sum / kernelCount);
    }
}

module.exports = KernelIterator;