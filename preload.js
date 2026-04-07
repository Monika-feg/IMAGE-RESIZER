const os = require('os');
const Toastify = require('toastify-js');
const { contextBridge, ipcRenderer, webUtils } = require('electron');

// Preload exponerar ett litet, säkert API till renderer i stället för rå Node-access.
contextBridge.exposeInMainWorld('appApi', {
    // Hämtar sökvägen till mappen där resized-bilder sparas.
    getOutputPath: async () => ipcRenderer.invoke('app:get-output-path'),
    // Gör om ett File-objekt från input-fältet till en riktig lokal filsökväg.
    getPathForFile: (file) => webUtils.getPathForFile(file),
    // Skickar resize-jobbet till main-processen som får använda filsystemet.
    resizeImage: async (payload) => ipcRenderer.invoke('image:resize', payload),
    // Samlar toast-visning här så renderer inte behöver känna till biblioteket direkt.
    showToast: (options) => Toastify(options).showToast(),
});