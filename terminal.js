//Importando las dependencias
const electron = require('electron');
const {ipcRenderer} = electron;

//Obtener comando del input
const form = document.querySelector('form');
form.addEventListener('submit', enviarFormulario);

console.log('HOLA');

function enviarFormulario(e){
    e.preventDefault();
    const comando = document.querySelector('#comando').value;
    console.log('Enviar comando:' + comando);
    ipcRenderer.send('comando:enviar', comando);
}
