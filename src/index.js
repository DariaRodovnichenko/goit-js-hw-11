import { fetchImages } from './fetch-images';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const endText = document.querySelector('.text');

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

let lightBox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionsDelay: 250,
});

formEl.addEventListener('submit', onSubmitForm);

async function onSubmitForm(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadBtn.classList.remove('is-hidden');
  } else {
    loadBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      createMarkup(response.hits);
      lightBox.refresh();
      endText.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.classList.add('is-hidden');
      endText.classList.remove('is-hidden');
      return;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
}

loadBtn.addEventListener('click', onclick);

async function onclick() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  createMarkup(response.hits);
  lightBox.refresh();

  if (currentHits === response.totalHits) {
    loadBtn.classList.add('is-hidden');
    endText.classList.remove('is-hidden');
  }
}
