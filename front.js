//Importando las dependencias
const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;

//------------ BOTONES DE CERRAR, MAX Y MIN ----------

document.getElementById("min-btn").addEventListener("click", function (e) {
    console.log('Minimizar');
    let action = 'min';
    ipcRenderer.send('request-mainprocess-action', action);
}); 

document.getElementById("max-btn").addEventListener("click", function (e) {
    console.log('Maximizar');
    let action = 'max';
    ipcRenderer.send('request-mainprocess-action', action);
}); 

document.getElementById("close-btn").addEventListener("click", function (e) {
    console.log('Cerrar');
    let action = 'close';
    ipcRenderer.send('request-mainprocess-action', action);
});


//------------ SOLICITO LISTA DE PUERTOS ------------
document.getElementById('actualizar'.addEventListener('click', obtenerListaDePuertos));

function obtenerListaDePuertos(e) {
    ipcRenderer.send('available-ports', arg);
    
}

ipcRenderer.sendSync('available-ports', arg);

//------------ BOTON CONECTAR ----------
document.getElementById('conectar').addEventListener('click', conectarPuerto);
let conexionActual = document.getElementById('conexionActual');

function conectarPuerto (e) {
    e.preventDefault();
    e.stopPropagation();
    let puerto = {
        name: document.getElementById('nombre').value,
        baudrate: document.getElementById('baudios').value,
        dataSize: document.getElementById('data-size').value.toLowerCase(),
        parity: document.getElementById('paridad').value,
        handshake: document.getElementById('handshake').value,
        mode: document.getElementById('modo').value
    }
    //Cambio de valores
    ipcRenderer.send('set-port-connection', puerto);
    conexionActual.innerHTML = puerto.name;
}