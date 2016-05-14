(function() {

  // Initializing Monocular
  Monocular.initialize({
    clientId: '9285659d91de8e1ee957ce95f378b902',
    clientSecret: '091baf225c2b34795c9dabac657115bc23a3cb48',
  });

  const uploadButton = $('#uploadBtn');
  const urlButton = $('#urlBtn');
  const facesElement = $('#faces');
  const resultElement = $('#result');
  const spinnerElement = $('#spinner');

  // Upload button handler
  uploadButton.on('change', e => detect(e.target.files[0]));

  // Url button handler
  urlButton.on('click', () => detect($('url').val()));

  // Finding faces using monocular
  function detect(image) {
    facesElement.html('');
    spinnerElement.show();
    Monocular.faceDetection(image).then((faces) => {
      spinnerElement.hide();

      resultElement.text('Detected ' + faces.length + ' face(s)');
      faces.forEach(face => crop(image, face));
    }).catch(() => {
      spinnerElement.hide();
      resultElement.text('Something went wrong! Is that a image?');
    });
  }

  // Cropping faces using monocular 
  function crop(image, face) {
    face.encodeType = 'JPEG';
    Monocular.crop(image, face).then((image) => {
      facesElement.append(image);
    });
  }
}());
