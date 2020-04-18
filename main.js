const electron = require("electron");
const uuid = require("uuid").v4;

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let indexWindow;
let createWindow;
let listWindow;

let allShopping = [];

app.on("ready", () => {
    indexWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Chess Shop"
    });

    indexWindow.loadURL(`file://${__dirname}/index.html`);
    indexWindow.on("closed", () => {

        app.quit()
        indexWindow = null;

    });
        const mainMenu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(mainMenu);
    });

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Product List"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Completely Your Shopping"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null));


};

ipcMain.on("shopping:create", (event, shopping) => {
    shopping["id"] = uuid();
    shopping["done"] = 0;
    allShopping.push(shopping);

    createWindow.close();

    console.log(allShopping);
});
ipcMain.on("shopping:request:list", event => {
    listWindow.webContents.send('shopping:response:list', allShopping);
});
ipcMain.on("shopping:done", (event, id) => {
    console.log("here");
});

const menuTemplate = [{
        label: "file",
        submenu: [{
                label: "New Product",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "List Product",
                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "CTRL + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{
            role: "reload"
        }, {
            role: "toggledevtools"
        }]
    }
]