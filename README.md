# IMAGE-RESIZER

En enkel Electron-app för att ändra storlek på bilder lokalt på datorn.

Appen låter användaren välja en bild, läsa in bildens originalmått automatiskt och sedan spara en ny version med valfri bredd och höjd. Den färdiga bilden sparas i en separat output-mapp i användarens hemkatalog.

## Funktioner

- Välj en lokal bildfil från datorn
- Läser in bildens originalbredd och originalhöjd automatiskt
- Ändra storlek genom att ange ny bredd och höjd
- Sparar den nya bilden lokalt i en output-mapp
- Öppnar output-mappen automatiskt när bilden har skapats
- Fel- och statusmeddelanden visas direkt i gränssnittet

## Stödda bildformat

- PNG
- JPG / JPEG
- GIF

## Teknik

- Electron
- Node.js
- resize-img
- Toastify

## Installation

Klona projektet och installera beroenden:

```bash
npm install
```

## Starta appen

```bash
npm start
```

## Så fungerar den

1. Välj en bildfil.
2. Appen fyller automatiskt i bildens nuvarande bredd och höjd.
3. Ange de nya måtten du vill använda.
4. Skicka formuläret för att skapa den nya bilden.
5. Resultatet sparas i en lokal mapp och öppnas automatiskt.

## Var sparas bilderna?

De resized-bilderna sparas här:

```text
~/imageresizer
```

På Windows motsvarar det normalt något i stil med:

```text
C:\Users\<ditt-användarnamn>\imageresizer
```

## Projektstruktur

```text
.
├── main.js
├── preload.js
├── package.json
├── README.md
└── renderer
	├── about.html
	├── index.html
	├── css
	│   └── style.css
	├── images
	└── js
		└── renderer.js
```

## Utvecklingsanteckningar

- `main.js` hanterar Electron-fönster, meny, IPC och själva bildbearbetningen.
- `preload.js` exponerar ett säkert API mellan main process och renderer.
- `renderer/js/renderer.js` hanterar formulärlogik, validering och UI-feedback.
- `node_modules` är exkluderat via `.gitignore` och ska inte versioneras.

## Möjliga förbättringar

- Behålla originalets proportioner automatiskt
- Låta användaren välja egen output-mapp
- Stöd för fler bildformat
- Dra-och-släpp för bilduppladdning
- Export med kvalitet/komprimeringsinställningar

## License

MIT
