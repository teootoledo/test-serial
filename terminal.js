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

//Obtener comando del input
let comando = document.getElementById('comando');
let send_btn = document.getElementById('send');

send_btn.addEventListener('click', function () {
    console.log('Send');
    let nuevoComando = comando.value;
    port.write(nuevoComando);
})