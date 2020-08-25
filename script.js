const imageContainer = document.getElementById('image-container');
const unUsedForm = document.getElementById('unUsedForm');
const inputSearch = document.getElementById('inputSearch');
const btnSearch = document.getElementById('btnSearch');
const pReqInfo = document.getElementById('pReqInfo');
const pPhotosFound = document.getElementById('pPhotosFound');
const requestInfo = document.getElementById('requestInfo');

let photosArray = [];
let searchCriteria = '';
let requestsMade = 0;
let searchable = false;

// api
let apiKeys = {
  Malii: 'm6aPZ5dJ82VNd62MX98vq3bwk6x9lqVQJvQO-2HLnjw',
  Andrusika: 'nGrxUdbvYnMxMkS0E9sHru5TJz6QAVjCEA3z00W3MR0',
};

let apiKey;
getWorkingKey();
let count = 10;
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
    requestInfo.style.display = 'block';
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
    console.log(data);
    //setStats
    photosArray = data;
    requestInfo.style.display = 'none';

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
    const item = document.createElement('a');
    item.setAttribute('href', photo.links.html);
    item.setAttribute('target', '_blank');

    // create img
    const img = document.createElement('img');

    img.setAttribute('src', photo.urls.regular);

    //put img inside <a>
    // img.addEventListener('load');
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}
let oneTime = 0;
// scroll functionality
window.addEventListener('scroll', () => {
  const canFetch =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2000 &&
    photosArray.length !== 0 &&
    page != totalPages;

  if (canFetch && oneTime == 0) {
    oneTime = 1;
    page++;
    apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
    searchPhotos();
    setTimeout(() => {
      oneTime = 0;
    }, 1000);
  }
});

//searches on click
btnSearch.addEventListener('click', () => {
  resetStats();
  photosArray = [];
  if (searchable) searchPhotos();
  else randomPhotos();
});

inputSearch.addEventListener('input', function () {
  searchCriteria = this.value;
  apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
  setBtnLabel();
});

//Nu ne trebuie formu doar sa scot hneaua asta
unUsedForm.addEventListener('submit', (e) => e.preventDefault());

//if invisible set visible, else visible
function openLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
}

function closeLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}

function resetStats() {
  page = 1;
  totalPages = 0;
  totalPages = 0;
  imageContainer.innerHTML = '';
}

function setRequestLabel(finished = false) {
  if (finished) {
    pReqInfo.innerHTML = `Probably no more requests left but try again!)) )`;
    alert(
      "Probably no more requests left((, But try i again i've done something"
    );
  } else {
    if (requestsMade >= 50) pReqInfo.style.color = 'red';
    else pReqInfo.style.color = 'green';
    pReqInfo.innerHTML = `${requestsMade} requests made since you opened the app`;
    pPhotosFound.innerHTML = `There are ${totalPhotos} images found! <br/>`;
  }
}

function toggleAccountSource() {
  if (apiKey == apiKeys.Malii) {
    apiKey = apiKeys.Andrusika;
    apiURLS.Random = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;
  } else {
    apiKey = apiKeys.Malii;
    apiURLS.Random = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;
  }
}

function setBtnLabel() {
  if (searchCriteria) {
    searchable = true;
    btnSearch.innerHTML = 'Search';
  } else {
    searchable = false;
    btnSearch.innerHTML = 'Get Random Photos';
  }
}

setBtnLabel();
setRequestLabel();

function getWorkingKey() {
  let key = apiKeys.Malii;
  let url = `https://api.unsplash.com/photos/random?client_id=${key}`;

  fetch(url).then(
    () => {
      apiKey = key;
      apiURLS = {};
      apiURLS = {
        Random: `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`,
        Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
      };
    },
    () => {
      key = apiKeys.Andrusika;
      url = `https://api.unsplash.com/photos/random?client_id=${key}`;
      fetch(url).then(
        () => {
          apiKey = key;
          apiURLS = {};
          apiURLS = {
            Random: `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`,
            Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
          };
        },
        () => {
          apiKey = apiKey.Malii;
          apiURLS = {};
          apiURLS = {
            Random: `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`,
            Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
          };
        }
      );
    }
  );
}
