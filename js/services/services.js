import pathsApi from './paths-api.js';

export default {
	/**
	 * @description Promesa para obtener los gifs trending
	 * @param limit - limite de registros que se desea obtener - type: String
	 * @param offset - desde donde empieza a traer la data - type: Number
	 * @returns Promise
	 */
	getApiTrending(limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_TRENDING}?api_key=${pathsApi.API_KEY}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener data de autocompletado en el buscador de la página
	 * @param search - termino a buscar en los datos de la api - type: String
	 * @returns Promise
	 */
	getApiAutocomplete(search) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_AUTOCOMPLETE}?api_key=${pathsApi.API_KEY}&q=${search}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener data de lo que busco el cliente
	 * @param search - termino a buscar en los datos de la api - type: String
	 * @param limit - limite de registros que se desea obtener - type: Number
	 * @param offset - desde donde empieza a traer la data - type: Number
	 * @returns Promise
	 */
	getApiSearch(search, limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_SEARCH}?api_key=${pathsApi.API_KEY}&q=${search}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener las recomendaciones de busqueda
	 * @param limit - limite de registros que se desea obtener - type: String
	 * @param offset - desde donde empieza a traer la data - type: Number
	 * @returns Promise
	 */
	getApiTrendingSearch() {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_SEARCH_TRENDING}?api_key=${pathsApi.API_KEY}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener un gif en especifico
	 * @param string id - type: String
	 * @returns Promise
	 */
	getApiGifByID(id) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_GIF_BY_ID}${id}?api_key=${pathsApi.API_KEY}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	postUploadGif(blob) {
		const url = `${pathsApi.API_UPLOAD_GIFO}?api_key=${pathsApi.API_KEY}`;

		const form = new FormData();
		form.append('file', blob, 'myGif.gif');

		return new Promise((resolve, reject) => {
			fetch(url, { method: 'POST', body: form })
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Objetener los favoritos del usuario
	 * @returns Array
	 */
	getAllFavoritesLocal() {
		if (!!localStorage.getItem('favorites')) {
			return JSON.parse(localStorage.getItem('favorites'));
		} else {
			return [];
		}
	},
	/**
	 * @description Objetener los favoritos del usuario
	 * @param limit - limite de registros que se desea obtener - type: Number
	 * @param offset - desde donde empieza a traer la data - type: Number
	 * @returns Array
	 */
	getPageFavoritesLocal(limit = 12, offset = 0) {
		if (!!localStorage.getItem('favorites')) {
			const favorites = JSON.parse(localStorage.getItem('favorites'));
			return favorites.slice(offset, offset + limit);
		} else {
			return [];
		}
	},
	/**
	 * @description Almacenar los favoritos del usuario
	 * @param Array - array que se agregará en el localStorage de 'favoritos' - type: Array
	 */
	setFavoritesLocal(array) {
		localStorage.setItem('favorites', JSON.stringify(array));
	},
	/**
	 * @description Objetener todos los gifs que crea el usuario
	 * @returns Array
	 */
	getAllMyGifsLocal() {
		if (!!localStorage.getItem('myGifs')) {
			return JSON.parse(localStorage.getItem('myGifs'));
		} else {
			return [];
		}
	},
	/**
	 * @description Objetener los favoritos del usuario
	 * @param limit - limite de registros que se desea obtener - type: Number
	 * @param offset - desde donde empieza a traer la data - type: Number
	 * @returns Array
	 */
	getPageMyGifsLocal(limit = 12, offset = 0) {
		if (!!localStorage.getItem('myGifs')) {
			const myGifs = JSON.parse(localStorage.getItem('myGifs'));
			return myGifs.slice(offset, offset + limit);
		} else {
			return [];
		}
	},
	/**
	 * @description Almacenar los gifos que crea el usuario
	 * @param Array - array que se agregará en el localStorage de 'miGifs' - type: Array
	 */
	setMyGifsLocal(array) {
		localStorage.setItem('myGifs', JSON.stringify(array));
	},
	/**
	 * @description Obtener el gif a descargar
	 * @param Url - url del gif para descargar - type: String
	 */
	downloadGif(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then((res) => res)
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
};
