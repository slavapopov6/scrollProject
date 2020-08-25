const imageContainer = document.getElementById("image-container");
const unUsedForm = document.getElementById("unUsedForm");
const inputSearch = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnSearch");
const pReqInfo = document.getElementById("pReqInfo");
const pPhotosFound = document.getElementById("pPhotosFound");
const requestInfo = document.getElementById("requestInfo");
const pSrcInfo = document.getElementById("pSrcInfo");

let photosArray = [];
let searchCriteria = "";
let requestsMade = 0;
let searchable = false;

// api
let apiKeys = {
  Malii: "m6aPZ5dJ82VNd62MX98vq3bwk6x9lqVQJvQO-2HLnjw",
  Andrusika: "nGrxUdbvYnMxMkS0E9sHru5TJz6QAVjCEA3z00W3MR0",
};

let apiKey;
getWorkingKey();
let count = 15;
let page = 1;
let totalPhotos = 0;
let totalPages = 0;

let apiURLS;

// getPhotos from api
async function searchPhotos() {
  if (!searchCriteria) return;
  let url = apiURLS.Search;
  openLoader();
  try {
    const response = await fetch(url);
    data = await response.json();
    requestsMade++;
    requestInfo.style.display = "block";
    //setStats
    totalPhotos = data.total;
    totalPages = data.total_pages;
    photosArray = data.results;

    displayPhotos();
    setRequestLabel();
    closeLoader();
  } catch (error) {
    closeLoader();
    console.log(error);
    setRequestLabel(true);
    toggleAccountSource();
  }
}

// getPhotos random from api
async function randomPhotos() {
  if (searchCriteria) return;
  let url = apiURLS.Random;
  openLoader();
  try {
    const response = await fetch(url);
    data = await response.json();
    requestsMade++;
    //setStats
    photosArray = data;
    requestInfo.style.display = "none";

    displayPhotos();
    setRequestLabel();
    closeLoader();
  } catch (error) {
    closeLoader();
    console.log(error);
    setRequestLabel(true);
    toggleAccountSource();
  }
}

// adding to the DOM
function displayPhotos() {
  if (photosArray.length == 0) return;
  photosArray.forEach((photo) => {
    const a = document.createElement("a");
    a.setAttribute("href", photo.urls.full);
    a.setAttribute("target", "_blank");
    a.setAttribute("data-toggle", "modal");
    a.setAttribute("data-target", "#photoModal");
    console.log(photosArray);
    // create img
    const img = document.createElement("img");
    img.setAttribute("src", photo.urls.regular);

    a.addEventListener("click", function () {
      const modalPhotoSrc = document.getElementById("modalPhotoSrc");
      const photoModalTitle = document.getElementById("photoModalTitle");
      photoModalTitle.innerHTML = photo.user.name;
      modalPhotoSrc.setAttribute("src", photo.urls.regular);
    });

    a.appendChild(img);
    imageContainer.appendChild(a);
  });
}

let oneTime = 0;

// scroll functionality
window.addEventListener("scroll", () => {
  const canFetch =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2000 &&
    photosArray.length !== 0 &&
    page != totalPages;

  if (canFetch && oneTime == 0) {
    oneTime = 1;
    page++;
    apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
    if (searchable) searchPhotos();
    else randomPhotos();
    setTimeout(() => {
      oneTime = 0;
    }, 1000);
  }
});

//searches on click
btnSearch.addEventListener("click", () => {
  resetStats();
  photosArray = [];
  if (searchable) searchPhotos();
  else randomPhotos();
});

inputSearch.addEventListener("input", function () {
  searchCriteria = this.value;
  apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
  setBtnLabel();
});

//Nu ne trebuie formu doar sa scot hneaua asta
unUsedForm.addEventListener("submit", (e) => e.preventDefault());

//if invisible set visible, else visible
function openLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}

function closeLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}

function resetStats() {
  page = 1;
  totalPages = 0;
  totalPages = 0;
  imageContainer.innerHTML = "";
}

function setRequestLabel(finished = false) {
  if (finished) {
    pReqInfo.innerHTML = `Probably no more requests left but try again later.`;
    alert("Probably no more requests left, But try i again later");
  } else {
    if (requestsMade >= 50) pReqInfo.style.color = "red";
    else pReqInfo.style.color = "green";
    pReqInfo.innerHTML =
      requestsMade === 1
        ? `${requestsMade} request was made since you opened the app`
        : `${requestsMade} requests were made since you opened the app`;
    pPhotosFound.innerHTML =
      totalPhotos === 1
        ? `There is ${totalPhotos} image found! <br/>`
        : `There are ${totalPhotos} images found! <br/>`;
  }
}

function toggleAccountSource() {
  if (apiKey == apiKeys.Malii) {
    apiKey = apiKeys.Andrusika;
    apiURLS.Random = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;
    pSrcInfo.innerHTML = "Andrusika";
  } else {
    apiKey = apiKeys.Malii;
    apiURLS.Random = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;
    pSrcInfo.innerHTML = "Malii";
  }
}

function setBtnLabel() {
  if (searchCriteria) {
    searchable = true;
    btnSearch.innerHTML = "Search";
  } else {
    searchable = false;
    btnSearch.innerHTML = "Get Random Photos";
  }
}

setBtnLabel();
setRequestLabel();

async function getWorkingKey() {
  let key = apiKeys.Malii;
  let url = `https://api.unsplash.com/photos/random?client_id=${key}`;
  try {
    const data = await (await fetch(url)).json();
    apiKey = key;
    apiURLS = {
      Random: `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`,
      Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
    };
    pSrcInfo.innerHTML = "Malii";
  } catch (error) {
    key = apiKeys.Andrusika;
    url = `https://api.unsplash.com/photos/random?client_id=${key}`;
    const data = await (await fetch(url)).json();
    apiKey = key;
    apiURLS = {
      Random: `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`,
      Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
    };
    pSrcInfo.innerHTML = "Andrusika";
  }
}
