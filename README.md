Face Finder Tutorial
====================

This tutorial shows you how to create a simple web app that extracts human faces from an image using Monocular API.

You can try the live version of the app [here](https://cdn.jemsoft.io/facefinder/).

The app uses Monocular Javascript SDK and two of Monocular API endpoints. With less than 50 lines of code you can make an app that detects faces and crops each of them all in your browser. We are going to use [Face Detection](http://docs.jemsoft.co/?javascript#face-detection) and [Crop](http://docs.jemsoft.co/?javascript#crop) endpoints in this tutorial.

Ok. Let's get our hands dirty.

If you haven't already, create a Monocular app for our web app from the dashboard. If you don't know how follow the instructions in the [documentation](http://docs.jemsoft.co/?javascript#getting-started). It's amazingly simple.

Now that we have our App Id and secret we can start coding. Let's make a project folder and call it `facefinder`. It's recommended that you serve this folder with a http server locally. You can use [http-server](https://github.com/indexzero/http-server) to do this, it's a simple command-line http server.

Let's create a simple HTML page with 2 buttons and a text box so we can get an image file from the user. Our app is going to handle both local files and urls. Monocular API accepts both images files and urls. When you pass a url, Monocular retrieves the image from the internet and processes it.

Create an `index.html` file, we need a simple user interface for our face finder and a place to dump all the faces in. So the code for our HTML file would look something like this:

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div>
      <h2>Face Finder</h2>
      <p>
      <input id="url" type="text" placeholder="paste a URL here...">
      </p>
      <p>
        <a href="#" id="urlBtn">use the URL</a>
        <input type="file" id="uploadBtn">
      </p>
      <p id="result"></p>
    </div>

    <div id="faces">
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script src="https://cdn.jemsoft.io/monocular-javascript-sdk/sdk-0.1.0.js"></script>
    <script src="app.js"></script>
  </body>
</html>

```

You can look at the complete code [here](https://github.com/Jemsoft/monocular-demo-facefinder/blob/master/index.html). We have used some Bootstrap magic to make it look pretty. If you are using the complete code make sure you add [`style.css`](https://github.com/Jemsoft/monocular-demo-facefinder/blob/master/style.css). Note that we are using [jQuery](https://code.jquery.com) to make our life easier.

Now that we have our UI set up, let's write some fancy Javascript to make that magic happen.

First of all, we need to initialise the SDK with our App ID and secret:

```javascript
Monocular.initialize({
  clientId: 'AppId',
  clientSecret: 'Secret',
});

```

To make our life easier, let's find all the elements that we need.

```javascript
const uploadButton = $('#uploadBtn');
const urlButton = $('#urlBtn');
const urlInput = $('#url');
const facesElement = $('#faces');
const resultElement = $('#result');
```

Okay, let's write a function that detects faces using [Face-Detection](http://docs.jemsoft.co/?javascript#face-detection) endpoint and updates the `result` element with the number of faces detected.

```javascript
  function detect(image) {
    Monocular.faceDetection(image).then((faces) => {
      resultElement.text('Detected ' + faces.length + ' face(s)');
    }).catch(() => {
      resultElement.text('Something went wrong! Is that a image?');
    });
  }
```

Where does the image come from? We need to make our file button and our URL button to call `detect` with image or url.

```javascript
  uploadButton.on('change', e => detect(e.target.files[0]));
  urlButton.on('click', () => detect(urlInput.val()));
```

That's it! Our app will now count the number of faces in an image.

To make it more interesting let's use [Crop](http://docs.jemsoft.co/?javascript#crop) to extract the faces from the image and append them to the page. Let's write a crop function that uses the bounding box from face-detection to extract the face out of the image. Each face is represented by 2 points (top, left), (bottom, right). We can pass the points straight to crop since it accepts the same 2 points to crop an image, however we need to add our desired encoding type to the object.

```javascript
function crop(image, face) {
  face.encodeType = 'JPEG';
  Monocular.crop(image, face).then((image) => {
    facesElement.append(image);
  });
}
```

Easy, right? Now we only need to call this function for every face in the image. Let's modify our `detect` function.

```javascript
function detect(image) {
  facesElement.html('');
  Monocular.faceDetection(image).then((faces) => {
    resultElement.text('Detected ' + faces.length + ' face(s)');
    faces.forEach(face => crop(image, face));
  }).catch(() => {
    resultElement.text('Something went wrong! Is that a image?');
  });
}
```

There you go! Our face finder app is now ready! You can look at the complete source code [here](https://github.com/Jemsoft/monocular-demo-facefinder).