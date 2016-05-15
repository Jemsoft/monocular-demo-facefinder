(function() {

  // Initializing Monocular
  Monocular.initialize({
    clientId: 'AppID',
    clientSecret: 'AppSecret',
  });

  const uploadButton = $('#uploadBtn');
  const urlButton = $('#urlBtn');
  const urlInput = $('#url');
  const facesElement = $('#faces');
  const resultElement = $('#result');
  const spinnerElement = $('#spinner');

  // Upload button handler
  uploadButton.on('change', e => detect(e.target.files[0]));

  // Url button handler
  urlButton.on('click', () => detect(urlInput.val()));

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
    Monocular.crop(image, face).then((faceImage) => {
      facesElement.append(faceImage);
    });
  }
}());
