//Dependencias
const electron = require('electron');
const url = require('url');
const path = require('path');
const SerialPort = require('serialport');
const Readline = require("@serialport/parser-readline");
const { event } = require('jquery');

//const { Menu } = require('electron'); //Esto lo agrega solo si no lo agrego en las dependencias de la ventana

//Ventana
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

//Escuchar a que la app esté lista -- ABRIR VENTANA PRINCIPAL
app.on('ready', function () {
   //Creo una nueva ventana
    mainWindow = new BrowserWindow(
        {
            width: 1366,
            height: 768,
            webPreferences:
            {
                nodeIntegration: true
            },
            transparent: true, 
            frame: false
        }
    );
    //Cargo el archivo html para la ventana principal
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));    //file://dirname/mainWindow.html

    //Cerrar las demás ventanas si se cierra esta.
    mainWindow.on('closed', function () {
        app.quit();
    })


    //Build del menú desde el template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insertar menú
    Menu.setApplicationMenu(mainMenu);
});

//Creo la plantilla del menú -- Es un menú que pisa el por defecto
const mainMenuTemplate = [
    {
        label: 'Menú' /*Primera pestaña*/,
        submenu: [
            {
                label: 'Abrir nueva terminal',
                click(){
                    openNewTerminalWindow();
                }
            },
            {
                label: 'Puerto',
                submenu: [
                    {
                        label: 'COM1'
                    },
                    {
                        label: 'COM2'
                    },
                    {
                        label: 'COM3'
                    },
                    {
                        label: 'COM4'
                    }
                ]
            },
            {
                label: 'Salir',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                  app.quit();
                }
            }
        ]
    }
];

//Si es mac, agrego un objeto vacío al menú
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({}); //unshift es un método para arrays que agrega lo que le pasemos al inicio del arreglo.
}


//Agrego las herramientas para desarrollador si el sw no está en producción

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push(
        {
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: 'CmdOrCtrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        }
        )
    }


//-----------------------------------------------------------------------
    
//Catchs de comandos a traves de IPC

//Conectar a puerto
var connectionState = false //Conexión en estado inicial.
ipcMain.on('set-port-connection', (event, config) => {
    conectarPuerto(config);
})

function conectarPuerto(config) {
    console.log(connectionState);
    
    //Definiendo el puerto serie
    const port = new SerialPort(config.name, {
        baudRate: parseInt(config.baudrate), //Parseo a int porque deben ser un valor entero
        dataBits: parseInt(config.dataSize),
        parity: config.parity
        
    });
    //Parser del puerto serie
    const parser = new Readline();
    port.pipe(parser);
    
    //Leo data del puerto serie
    parser.on('data', function(data) {
        console.log(data);
    });
    console.log(config.parity);
    connectionState = true;
    console.log(connectionState);
}


//Envío lista de puertos disponibles
ipcMain.on('available-ports', (event, arg) => {
    
    var getPortsList = (callback) => {
        var portsList = [];
      
        SerialPort.list((err, ports) => {
            ports.forEach((port) => {
                portsList.push(port.comName);
            });
      
            callback(null, portsList);
        });
    };
    console.log('Puertos enviados');
    event.returnValue = portsList;
  })

//Enviar comando
 ipcMain.on('comando:enviar', function(e, comando){
    mainWindow.webContents.send('comando:enviar', comando);
    enviarComando(comando);
 })

//Controles de ventana
ipcMain.on('request-mainprocess-action', (event, arg) => {
    if (arg == 'close') {
        app.quit();
    } else if (arg == 'max') {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    } else if (arg == 'min') {
        mainWindow.minimize();
    }
})
    
//------------ ENVIAR VIA SERIAL ----------------//



function enviarComando(comando){
    comando = '<'+comando+'>';
    port.write(comando);
    console.log('Se envía comando: '+comando+ ' por COM' + 1);
}

