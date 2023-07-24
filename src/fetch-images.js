import axios from 'axios';

export async function fetchImages(value, page) {
    const API_KEY = '38424030-1fa37e2b99732f8958e5ecc88';
    const BASE_URL = 'https://pixabay.com/api/';
    const filter = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    return await axios.get(`${BASE_URL}${filter}`).then(response => response.data);
}
