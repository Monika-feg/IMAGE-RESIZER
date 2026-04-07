 
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin';

let mainWindow;

// Skapar appens huvudfönster och kopplar in preload-bryggan mot renderer.
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Rosa Bildförminskare',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: false,
          preload: path.join(__dirname, 'preload.js')
        }
    });

      // DevTools öppnas bara i utvecklingsläge.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
        
}

// Skapar ett separat informationsfönster från menyn.
function createAboutWindow(){
      const aboutWindow = new BrowserWindow({
        title: 'Om Rosa Bildförminskare',
        width: 300,
        height: 300,
    });


    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
  
}

// När Electron är redo startas huvudfönstret och applikationsmenyn.
app.whenReady().then(() => {
    createMainWindow();

  // Bygger menyn från mallen nedan.
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

  // Nollställer referensen när fönstret stängs.
    mainWindow.on('close', () => (mainWindow = null));

     app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
});

// Enkel meny med Om på macOS och under Hjälp på Windows/Linux.
const menu = [
  ...(isMac 
    ? [
      {
    label: app.name,
    submenu: [
      {
        label: 'Om',
        click: createAboutWindow
      }
    ]
  }
] : []),
  {
   role: 'fileMenu'
  },
  ...(!isMac 
    ? [
    {
    label: 'Hjälp',
    submenu: [
      {
      label: 'Om',
      click: createAboutWindow
    },
  ]
  }
] : []),
];

// Renderer frågar main var resized-bilder ska sparas.
ipcMain.handle('app:get-output-path', () => {
  return path.join(os.homedir(), 'imageresizer');
});

// Main ansvarar för filsystem och bildbehandling, inte renderer.
ipcMain.handle('image:resize', async (_event, options) => {
  const dest = path.join(os.homedir(), 'imageresizer');
  const output = await resizeImage({ ...options, dest });
  return output;
});

// Läser originalbilden, resizar den och sparar resultatet i output-mappen.
async function resizeImage({ imgPath, width, height, dest }) {
  const resizedImage = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height
  });

  // Behåller originalets filnamn men sparar den nya versionen i output-mappen.
  const filename = path.basename(imgPath);
  const outputPath = path.join(dest, filename);

  // Skapar output-mappen första gången appen används.
  if(!fs.existsSync(dest)){
    fs.mkdirSync(dest);
  }

  // Skriver den resized-bilden till disk.
  fs.writeFileSync(outputPath, resizedImage);

  // Öppnar mappen direkt så användaren ser resultatet.
  shell.openPath(dest);

  return {
    filename,
    outputPath,
  };

}


app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})