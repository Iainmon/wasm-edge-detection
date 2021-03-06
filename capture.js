var NodeWebcam = require("node-webcam");


//Default options

var opts = {

    //Picture related

    width: 1280,

    height: 720,

    quality: 100,


    //Delay in seconds to take shot
    //if the platform supports miliseconds
    //use a float (0.1)
    //Currently only on windows

    delay: 0,


    //Save shots in memory

    saveShots: true,


    // [jpeg, png] support varies
    // Webcam.OutputTypes

    output: "jpeg",


    //Which camera to use
    //Use Webcam.list() for results
    //false for default device

    device: false,


    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes

    callbackReturn: "location",


    //Logging

    verbose: false

};


//Creates webcam instance

var Webcam = NodeWebcam.create(opts);




module.exports = Webcam;    
