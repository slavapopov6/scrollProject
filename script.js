const imageContainer = document.getElementById('image-container');
const unUsedForm = document.getElementById('unUsedForm');
const inputSearch = document.getElementById('inputSearch');
const btnSearch = document.getElementById('btnSearch');
const pReqInfo = document.getElementById('pReqInfo');

let photosArray = [];
let searchCriteria = '';
let requestsMade = 0;

// api
let apiKeys = {
  Malii: 'm6aPZ5dJ82VNd62MX98vq3bwk6x9lqVQJvQO-2HLnjw',
  Andrusika: 'nGrxUdbvYnMxMkS0E9sHru5TJz6QAVjCEA3z00W3MR0',
};
const apiKey = apiKeys.Malii;
let count = 10;
let page = 1;
let totalPhotos = 0;
let totalPages = 0;

let apiURLS = {
  Random: `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`,
  Search: `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`,
};

// getPhotos from api
async function searchPhotos() {
  if (!searchCriteria) return;
  let url = apiURLS.Search;
  openLoader();
  try {
    const response = await fetch(url);
    data = await response.json();
    requestsMade++;

    //setStats
    totalPhotos = data.total;
    totalPages = data.total_pages;
    photosArray = data.results;

    displayPhotos();
    setRequestLabel();
    closeLoader();
  } catch (error) {
    console.log(error);
    setRequestLabel(true);
    toggleAccountSource();

    closeLoader();
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

// scroll functionality
window.addEventListener('scroll', () => {
  const canFetch =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
    photosArray.length !== 0 &&
    page != totalPages;

  if (canFetch) {
    page++;
    apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
    searchPhotos();
  }
});

//searches on click
btnSearch.addEventListener('click', () => {
  resetStats();
  photosArray = [];
  searchPhotos();
});

inputSearch.addEventListener('change', function () {
  searchCriteria = this.value;
  apiURLS.Search = `https://api.unsplash.com/search/photos?page=${page}&query=${searchCriteria}&client_id=${apiKey}`;
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
    pReqInfo.innerHTML = `Probably no more requests left((, but try again!)) )`;
    alert(
      "Probably no more requests left((, But try i again i've done something"
    );
  }
  if (requestsMade >= 50) pReqInfo.style.color = 'red';
  else pReqInfo.style.color = 'green';
  pReqInfo.innerHTML = `There are ${totalPhotos} images found! <br/> ${requestsMade} requests made since you opened the app`;
}

function toggleAccountSource() {
  if (apiKey == apiKeys.Malii) apiKeys = apiKeys.Andrusika;
  else apiKeys = apiKeys.Malii;
}
setRequestLabel();
