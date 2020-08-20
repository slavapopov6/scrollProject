const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
initialLoad = true;

// api
let count = 5;
const apiKey = "m6aPZ5dJ82VNd62MX98vq3bwk6x9lqVQJvQO-2HLnjw";
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// check if images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    initialLoad = false;
    count = 30;
  }
}

// helper function
// function setAttributes(element, attribute) {
//   for (const key in attributes) {
//     element.setAttribute(key, attribute[key]);
//   }
// }

// adding to the DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    const item = document.createElement("a");
    item.setAttribute("href", photo.links.html);
    item.setAttribute("target", "_blank");
    // setAttributes(item, {
    //   href: photo.links.html,
    //   target: "_blank",
    // });
    // create img
    const img = document.createElement("img");

    // setAttributes(img, {
    //   src: photo.urls.regular,
    // });
    img.setAttribute("src", photo.urls.regular);
    //put img inside <a>
    img.addEventListener("load", imageLoaded);
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}
// loading is finished

// getPhotos from api
async function getPhotos() {
  try {
    const response = await fetch(apiURL);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {}
}
// scroll functionality
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// on load
getPhotos();
