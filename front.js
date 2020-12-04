//Importando las dependencias
const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;

//Obtener comando del input
// const form = document.querySelector('form');
// form.addEventListener('submit', enviarFormulario);

// console.log('HOLA');

// function enviarFormulario(e){
//     e.preventDefault();
//     const comando = document.querySelector('#comando').value;
//     console.log('Enviar comando:' + comando);
//     ipcRenderer.send('comando:enviar', comando);
// }

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