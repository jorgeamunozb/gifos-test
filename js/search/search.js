import api from '../services/services.js';
import gif from '../common/gif.js';

//? VARIABLES ****************
// search
const containerSearch = document.querySelector('#search-input');
const searchInput = document.querySelector('#search');
const searchList = document.querySelector('#list-search');
const searchTrendings = document.querySelectorAll('#search-trending span');
const btnSeeMore = document.querySelector('#btn-rounded');
// icons
const searchIconLeft = document.querySelector('#icon-search-left');
const searchIconRight = document.querySelector('#icon-search-right');
// sections
const sectionInfoSearch = document.querySelector('#info-search');
const sectionDataSearch = document.querySelector('#gifs-section');
const containerGifsSearch = document.querySelector('#gifs-results');
const titleSearch = document.querySelector('#title-search');

// data
let totalGifs = 0;
let dataGifs = [];

//? FUNCTIONS ****************
/**
 * @description Llenado de la lista de sugerencias del buscador
 */
const handleDataAutocomplete = () => {
	const search = searchInput.value;
	toggleIconsSearch();

	api.getApiAutocomplete(search)
		.then((res) => {
			const { data } = res;
			searchList.innerHTML = ''; // Reseteamos la lista.
			let lista = '';

			if (data.length) {
				data.forEach((item) => {
					lista += `<li class="item-list-autocomplete" id="value-${item.name}"><i class="icon-search"></i>${item.name}</li>`;
				});
				searchList.innerHTML = lista;
				addEventAutocomplete();
				containerSearch.classList.add('active');
			} else {
				containerSearch.classList.remove('active');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición handleDataAutocomplete en la API: ', err);
		});
};

/**
 * @description mostrar los gifs que el usuario busco
 * @param seeMore - Si el evento viene del boton "ver mas" - type: Boolean
 */
const handleDataSearch = (seeMore = false) => {
	if (!seeMore) {
		totalGifs = 0;
		dataGifs = [];
	}
	const search = searchInput.value;
	const offset = totalGifs || 0;
	titleSearch.innerText = search.toUpperCase();

	api.getApiSearch(search, 12, offset)
		.then((res) => {
			const { data, pagination } = res;
			if (!seeMore) containerGifsSearch.innerHTML = '';

			if (data.length) {
				// Guardando la data que ya se buscó
				totalGifs += data.length;
				// traemos los favoritos
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = '';

				data.forEach((item) => {
					dataGifs.push(item);
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'heart' : 'heart-outline';
					// Usamos el metodo para pintar los GIFS
					templateGifs += gif.maskGifs(item, iconFav);
				});
				// Pintar los gifs
				containerGifsSearch.insertAdjacentHTML('beforeend', templateGifs);

				// Agregamos eventos a los botones de accion de los GIFS...
				gif.addEventMobile(
					dataGifs,
					dataGifs.map((i) => i.id),
				);
				gif.addEventFavorites(dataGifs.map((i) => i.id));
				gif.addEventDownloadGif(dataGifs.map((i) => i.id));
				gif.addEventFullScreenGif(dataGifs);
				// Si NO se tienen mas gifs oculta el boton ver mas...
				totalGifs < pagination.total_count ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
			}

			containerSearch.classList.remove('active');
			toggleIconsSearch();
			showSectionSearch(data.length ? true : false);
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

/**
 * @description Agregando evento a las sugerencias en el buscador
 */
const addEventAutocomplete = () => {
	const itemsListAutocomplete = document.querySelectorAll('.item-list-autocomplete');

	itemsListAutocomplete.forEach((item) => {
		item.addEventListener('click', handleSearchByAutocomplete);
	});
};

/**
 * @description Buscar por gif por sugerencia
 */
const handleSearchByAutocomplete = () => {
	searchInput.value = event.target.id.replace('value-', '');
	handleDataSearch();
};

/**
 * @description Mostrar u ocultar las secciones al hacer una busqueda de gif
 * @param validateData - Si la consulta tiene datos muestra la seccion correspondiente - type: Boolean
 */
const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionInfoSearch.classList.remove('active');
		sectionDataSearch.classList.add('active-data');
		sectionDataSearch.classList.remove('active-no-data');
	} else {
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.add('active-no-data');
		sectionDataSearch.classList.remove('active-data');
	}
};

/**
 * @description Cambiar los iconos del buscador entre lupa y X
 */
const toggleIconsSearch = () => {
	if (searchInput.value) {
		searchIconRight.classList.add('icon-close');
		searchIconRight.classList.remove('icon-search');
	} else {
		searchIconRight.classList.add('icon-search');
		searchIconRight.classList.remove('icon-close');
	}
};

/**
 * @description Limpiar el buscador de gifs
 */
const handleResetSearch = () => {
	if (searchInput.value) {
		containerSearch.classList.remove('active');
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.remove('active-no-data');
		sectionDataSearch.classList.remove('active-data');
		searchInput.value = '';
		searchList.innerHTML = '';
		searchIconRight.classList.add('icon-search');
		searchIconRight.classList.remove('icon-close');
	}
};

const getTrendingSearch = () => {
	api.getApiTrendingSearch()
		.then((res) => {
			const trendings = res.data.slice(0, 5);

			trendings.forEach((text, key) => {
				searchTrendings[key].innerText = text;
			});
		})
		.catch((err) => {
			console.log('Error al hacer consulta getApiTrendingSearch() ', err);
		});
};

const addEventSearchTrendings = () => {
	searchTrendings.forEach((element) => {
		element.addEventListener('click', autocompleteTrending);
	});
};

const autocompleteTrending = () => {
	searchInput.value = event.target.innerText;
	handleDataSearch();
};

//? EVENTS *******************
searchInput.addEventListener('keyup', (event) => {
	// Si se preciona Enter en el buscador hace la petición...
	if (event.keyCode === 13 && searchInput.value.length) {
		event.preventDefault();
		handleDataSearch();
	}
});
searchIconLeft.addEventListener('click', handleDataSearch);
btnSeeMore.addEventListener('click', () => handleDataSearch(true));
searchInput.addEventListener('input', handleDataAutocomplete);
searchIconRight.addEventListener('click', handleResetSearch);

addEventSearchTrendings();
getTrendingSearch();
