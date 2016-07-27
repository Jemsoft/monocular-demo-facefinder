(function() {

  // Initializing Monocular
  Monocular.initialize({
    clientId: '551a468c21766e0df17d16a51292c0a4',
  });

  const uploadButton = $('#uploadBtn');
  const urlButton = $('#urlBtn');
  const urlInput = $('#url');
  const facesElement = $('#faces');
  const resultElement = $('#result');
  const spinnerElement = $('#spinner');
  const exampleImage = $('.example-image');

  // Example image handler
  exampleImage.on('click', (e) => detect(e.target.currentSrc));

  // Upload button handler
  uploadButton.on('change', e => detect(e.target.files[0]));

  // Url button handler
  urlButton.on('click', () => detect(urlInput.val()));

  let imageId;
  let faceNum;
  let i;

  // Finding faces using monocular
  function detect(image) {
    facesElement.html('');
    spinnerElement.show();
    Monocular.image.create(image, {}).then((img) => {
      imageId = img.id;
      face((detected) => {
        if (!detected) {
          console.log('not detected upsale');
          Monocular.image.upscale(imageId, {
            encodeType: 'JPEG',
            save: true,
            returnImage: false,
          }).then((res) => {
            face((detected2) => {
              if (!detected2) {
                console.log('not detected upsale 2');
                Monocular.image.upscale(imageId, {
                  encodeType: 'JPEG',
                  save: true,
                  returnImage: false,
                }).then((res) => {
                  face((detected3) => {
                    if (!detected3) resultElement.text('Detected 0 face(s)');
                  });
                });
              }
            });
          });
        }
      });
    });
  }

  function face(cb) {
    Monocular.image.faceDetection(imageId).then((faces) => {
      spinnerElement.hide();

      if (faces.length) {
        resultElement.text('Detected ' + faces.length + ' face(s)');
        i = 0;
        faceNum = faces.length;
        faces.forEach(face => crop(image, face));
        cb(true);
      } else {
        cb(false);
      }
    }).catch(() => {
      spinnerElement.hide();
      resultElement.text('Something went wrong! Is that a image?');
    });
  };

  // Cropping faces using monocular
  function crop(image, face) {
    face.encodeType = 'JPEG';
    Monocular.image.crop(imageId, face).then((faceImage) => {
      facesElement.append(faceImage);
      i++;
      if (i == faceNum) Monocular.image.del(imageId);
    });
  }
}());
