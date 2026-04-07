const imageForm = document.querySelector('#img-form');
const imageInput = document.querySelector('#img');
const outputPathText = document.querySelector('#output-path');
const fileNameText = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


// Körs när användaren väljer en bild och fyller formuläret med originalstorleken.
async function loadImage(e) {
    const file = e.target.files[0]

    if(!isFileImage(file)){
    alertError('Välj en bildfil.');
        return;
    }

    // Läser bildens riktiga mått innan användaren ändrar dem.

    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    // Visar formuläret först när en giltig bild har valts.
    imageForm.style.display = 'block';
    fileNameText.innerText = file.name;
    outputPathText.innerText = await appApi.getOutputPath();
}

  // Samlar inputvärden och skickar resize-jobbet vidare till main-processen.
async function sendImage(e){
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const file = imageInput.files[0];
    
  if(!file){
    alertError('Ladda upp en bild först.');
    return;
  }  

  const imgPath = appApi.getPathForFile(file);

   if (!imgPath) {
    alertError('Kunde inte läsa bildens sökväg.');
    return;
  }

  if(width === '' || height === ''){
    alertError('Fyll i både bredd och höjd.');
    return;
  }

  try {
    // Main returnerar sökvägen till den färdiga filen efter resize.
    const result = await appApi.resizeImage({
      imgPath,
      width,
      height,
    });

    outputPathText.innerText = result.outputPath;
    alertSuccess(`Bilden förminskades till ${width} x ${height}.`);
  } catch (error) {
    alertError(error.message || 'Det gick inte att förminska bilden.');
  }
}

// Begränsar input till de bildtyper som appen faktiskt stödjer.
function isFileImage(file){
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];
    return file && acceptedImageTypes.includes(file['type']);
}

// En gemensam feltoast ger samma utseende över hela appen.
function alertError(message) {
  appApi.showToast({
     text: message,
     duration: 5000,
     close: false,
     style: {
       background: 'red',
       color: 'white',
       textAlign: 'center'
     }
    
    });
}

// En gemensam successtoast används när resize-flödet är klart.
function alertSuccess(message) {
  appApi.showToast({
     text: message,
     duration: 5000,
     close: false,
     style: {
       background: 'green',
       color: 'white',
       textAlign: 'center'
     }
    
    });
}

imageInput.addEventListener('change', loadImage);
imageForm.addEventListener('submit', sendImage);
