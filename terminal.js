//Importando las dependencias

const SerialPort = require('serialport'); //npm i serialport
const Readline = require("@serialport/parser-readline");

//Definiendo el puerto serie
const port = new SerialPort('COM1', {
    baudRate: 9600
})

//Parser del puerto serie
const parser = new Readline();
port.pipe(parser);

//Leo data del puerto serie
parser.on('data', function(data) {
    console.log(data);
});

port.write("<Hola Mundo>");