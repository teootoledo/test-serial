//Dependencias
const electron = require('electron');
const url = require('url');
const path = require('path');
const { inAppPurchase } = require('electron');
//const { Menu } = require('electron'); //Esto lo agrega solo si no lo agrego en las dependencias de la ventana

//Ventana
const { app, BrowserWindow, Menu } = electron;

let mainWindow;

//Escuchar a que la app esté lista -- ABRIR VENTANA PRINCIPAL
app.on('ready', function () {
   //Creo una nueva ventana
    mainWindow = new BrowserWindow(
        {
            webPreferences:
            {
                nodeIntegration: true
            }
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

//Defino función para abrir una nueva terminal
function openNewTerminalWindow() {
    //Creo una nueva ventana
    terminalWindow = new BrowserWindow({
        width: 370,
        height: 250,
        title: 'COM Terminal'
    });
    //Cargo el archivo html para la ventana de la terminal
    terminalWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'terminalWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Manejo del garbage collector
    terminalWindow.on('close', function () {
        terminalWindow = null;
    }) //Algo asi como limpiarlo.
}

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