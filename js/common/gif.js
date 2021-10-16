import api from '../services/services.js';
const sectionGifs = document.querySelector('#gifs-section');
const containerGifs = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-rounded');
const modal = document.querySelector('#modal');
let validateEvent = true;
let positionGif = 0;

export default {
	/**
	 * @description Total de Gifs visibles en la seccion de favoritos
	 */
	totalGifs: 0,
	/**
	 * @description Actualziar el total de Gifs visibles en la seccion de favoritos
	 */
	setTotalGifs(totalGifs) {
		this.totalGifs = totalGifs;
	},
	/**
	 * @description Se encarga de pintar la lista de gifs
	 */
	maskGifs(gif, iconFav = 'heart', myGif = false) {
		// Si viene de la pagina favoritos pone el icono de corazon... si no pone el icono de papelera
		const icon = myGif ? `<i class="trash-${gif.id} icon-trash-normal"></i>` : `<i class="fav-${gif.id} icon-${iconFav}"></i>`;

		return `
			<div class="gifId-${gif.id} gif-container" data-target="gif">
				<video class="gifId-${gif.id} gif" height="${gif.images.original.height}" autoplay loop muted playsinline>
					<source src="${gif.images.original.mp4}" type="video/mp4">
					Gif...
				</video>
				<div class="hover-gif">
					<div class="gif-actions">
						${icon}
						<i class="download-${gif.id} icon-download-hover"></i>
						<i class="show-${gif.id} icon-max-screen"></i>
					</div>
					<div class="gif-info">
						<p class="gif-user">${gif.username}</p>
						<p class="gif-title">${gif.title}</p>
					</div>
				</div>
			</div>
		`;
	},
	/**
	 * @description pintar la informacion del gif en tamaño original
	 */
	maskGifFullScreen(gif, iconFav = 'heart', myGif = false) {
		// Si viene de la pagina favoritos pone el icono de corazon... si no pone el icono de papelera
		const icon = myGif ? `<i class="trash-${gif.id} icon-trash-normal"></i>` : `<i class="fav-${gif.id} icon-${iconFav}"></i>`;

		return `
			<i id="close-modal" class="close-modal icon-close"></i>
			<div class="view-gif-max">
				<div class="content-arrow-left">
					<div id="btn-arrow-left-max" class="btn-arrow-left">
						<i class="icon-arrow-left"></i>
					</div>
				</div>
				<div id="view-gif">
					<video class="gif" autoplay="" loop="" muted="" playsinline="">
						<source src="${gif.images.original.mp4}" type="video/mp4" />
						Gif...
					</video>
					<div class="gif-container-max">
						<div class="gif-info-max">
							<p class="gif-user">${gif.username}</p>
							<p class="gif-title">${gif.title}</p>
						</div>

						<div class="gif-action-max">
							${icon}
							<i class="download-${gif.id} icon-download-hover"></i>
						</div>
					</div>
				</div>
				<div class="content-arrow-right">
					<div id="btn-arrow-right-max" class="btn-arrow-right">
						<i class="icon-arrow-right"></i>
					</div>
				</div>
			</div>
		`;
	},
	/**
	 * @description Agregar Evento gif en mobile
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de favoritos - type: Array
	 */
	addEventMobile(arrGifs, ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.gifId-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => {
					const widthScreen = screen.width;
					if (widthScreen < 767) {
						this.fullScreenGif(arrGifs);
					}
				});
			});
		});
	},
	/**
	 * @description Agregar Evento de añadir gif a favoritos
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de favoritos - type: Array
	 */
	addEventFavorites(ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.fav-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => this.addGifFavorites());
			});
		});
	},
	/**
	 * @description Agregar Evento eliminar gif creado
	 * @param ids - id de los gifs los cuales se eliminaran de gifos creados - type: Array
	 */
	addEventDeleteMyGifo(ids) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.trash-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => this.deleteMyGifo(id));
			});
		});
	},
	/**
	 * @description Agregar Evento de descargar el gif
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de descarga - type: Array
	 */
	addEventDownloadGif(ids) {
		ids.forEach((id) => {
			const btnDownloads = document.querySelectorAll(`.download-${id}`);
			btnDownloads.forEach((btn) => {
				btn.addEventListener('click', () => this.downloadGif());
			});
		});
	},
	/**
	 * @description Agregar Evento de descargar el gif
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de descarga - type: Array
	 * @param arrGifs - marcar de que seccion se le dio click al gif - type: String
	 */
	addEventFullScreenGif(arrGifs) {
		const ids = arrGifs.map((i) => i.id);

		ids.forEach((id) => {
			const btnDownloads = document.querySelectorAll(`.show-${id}`);
			btnDownloads.forEach((btn) => {
				btn.addEventListener('click', () => this.fullScreenGif(arrGifs));
			});
		});
	},
	/**
	 * @description Obtener los elementos gifs que estan visibles en la pagina
	 */
	getGifsContainer() {
		return document.querySelectorAll('#gifs-results .gif-container');
	},
	/**
	 * @description Recargar gifs cuando está en la página de Favoritos
	 * @param favGifs - lista de gifs que el usuario tiene en favoritos - type: Array
	 * @param gifId - gif que se seleccionó - type: String - Number
	 */
	reloadPageGif(arrGifs, gifId, myGifos = false) {
		let gifsContainer = this.getGifsContainer();
		const gifRemove = document.querySelector(`#gifs-results .gifId-${gifId}`) || null;
		if (arrGifs.length <= gifsContainer.length || !!gifRemove) {
			if (!!gifRemove) gifRemove.remove();
		}

		// Si al eliminar un gif existen mas de lo que se muestran.. agrega el siguiente
		gifsContainer = this.getGifsContainer();
		if (arrGifs.length > gifsContainer.length && (gifsContainer.length % 12 !== 0 || gifsContainer.length == 0)) {
			const gifNew = arrGifs[gifsContainer.length];
			const templateGifs = this.maskGifs(gifNew);
			containerGifs.insertAdjacentHTML('beforeend', templateGifs);
			// agregar evento al gif que se agrego
			if (myGifos) {
				this.addEventDeleteMyGifo([gifNew.id]);
			} else {
				this.addEventFavorites([gifNew.id], true);
			}
			this.addEventDownloadGif([gifNew.id]);
			this.addEventFullScreenGif(arrGifs);
		}

		const gifs = this.getGifsContainer();
		this.setTotalGifs(gifs.length);
		arrGifs.length > gifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
	},
	/**
	 * @description Agregar gif a favoritos
	 */
	addGifFavorites() {
		if (validateEvent) {
			validateEvent = false;
			const gifId = event.target.classList[0].replace('fav-', '');
			const iconsGif = document.querySelectorAll(`.fav-${gifId}`);

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;
					const favorites = api.getAllFavoritesLocal();
					let iconFav = '';
					let iconRem = '';
					// Se valida si el Gif ya se encuentra en favoritos - si se encuentra lo quita.. si no lo agrega...
					if (favorites.some((fav) => fav.id === gifId)) {
						this.removeItemObjFromArr(favorites, gifId);
						iconFav = 'icon-heart-outline';
						iconRem = 'icon-heart';
					} else {
						favorites.push(data);
						iconFav = 'icon-heart';
						iconRem = 'icon-heart-outline';
					}

					// cambiar los iconos de los gifs
					iconsGif.forEach((btnFav) => {
						btnFav.classList.add(iconFav);
						btnFav.classList.remove(iconRem);
					});

					api.setFavoritesLocal(favorites);

					// Mostrar secciona de data o sin data en Favoritos
					if (window.location.pathname == '/views/favoritos.html') {
						if (favorites.length) {
							sectionGifs.classList.add('active-data');
							sectionGifs.classList.remove('active-no-data');
						} else {
							sectionGifs.classList.add('active-no-data');
							sectionGifs.classList.remove('active-data');
						}

						this.reloadPageGif(favorites, gifId);
					}
				})
				.catch((err) => {
					console.log('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
	},
	/**
	 * @description Eliminar gifo de mis gifos creados
	 */
	deleteMyGifo(id) {
		const myGifos = api.getAllMyGifsLocal();
		this.removeItemObjFromArr(myGifos, id);
		api.setMyGifsLocal(myGifos);
		this.reloadPageGif(myGifos, id);
	},
	/**
	 * @description Descargar el gif
	 * @param createGif - Si viene de la pagina crear mi gif - type: Boolean
	 * @param id - Si viene de la pagina crear mi gif pasar el id del gif - type: String
	 */
	downloadGif(createGif = false, id = null) {
		const gifId = createGif ? id : event.target.classList[0];

		api.getApiGifByID(gifId.replace('download-', ''))
			.then((res) => {
				const { data } = res;
				// Obtener el gif a descargar
				api.downloadGif(data.images.original.url)
					.then((response) => {
						// Crear el descargable
						response
							.blob()
							.then((file) => {
								const a = document.createElement('a');
								a.download = data.id;
								a.href = window.URL.createObjectURL(file);
								a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
								a.click();
							})
							.catch((err) => {
								console.error('Error al crear descargable: ', err);
							});
					})
					.catch((err) => {
						console.error('Error al descargar el gif: ', err);
					});
			})
			.catch((err) => {
				console.error('Error al hacer la petición getApiGifByID en la API: ', err);
			});
	},
	/**
	 * @description Compartir el gif
	 * @param id - id del gif - type: String
	 */
	shareGif(id) {
		api.getApiGifByID(id)
			.then((res) => {
				const { data } = res;
				alert(data.url);
			})
			.catch((err) => {
				console.error('Error al hacer la petición shareGif() en la API: ', err);
			});
	},
	/**
	 * @description Mostrar gif en tamñano original
	 * @param arrGifs - lista de gifs - type: Array
	 */
	fullScreenGif(arrGifs) {
		if (validateEvent) {
			validateEvent = false;
			let gifId = null;
			if (event.target.classList[0].includes('show-')) {
				gifId = event.target.classList[0].replace('show-', '');
			} else {
				gifId = event.target.classList[0].replace('gifId-', '');
			}

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;

					positionGif = arrGifs.map((item) => item.id).indexOf(data.id);

					document.querySelector('#modal').classList.remove('modal-closed');
					document.body.style.overflow = 'hidden'; // quitar el scroll

					// Pintar la info del gif
					const gifsFav = api.getAllFavoritesLocal();
					const iconFav = gifsFav.some((fav) => fav.id === data.id) ? 'heart' : 'heart-outline';
					modal.innerHTML = this.maskGifFullScreen(data, iconFav);

					this.addEventChangeGif(arrGifs);
					this.addEventFavorites([data.id]);
					this.addEventDownloadGif([data.id]);
				})
				.catch((err) => {
					console.error('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
	},
	/**
	 * @description Agregar eventos a los botones de ver el gif en tamaño original
	 * @param arrGifs - lista de gifs - type: Array
	 */
	addEventChangeGif(arrGifs) {
		// Evento cerrar el modal
		document.querySelector('#close-modal').addEventListener('click', this.closeModal);
		// Agregamos el evento de cambiar gif al modal ver gif en tamaño original
		document.querySelector('#btn-arrow-left-max').addEventListener('click', () => this.reloadGifFullScreen(arrGifs, true));
		document.querySelector('#btn-arrow-right-max').addEventListener('click', () => this.reloadGifFullScreen(arrGifs, false));
	},
	/**
	 * @description Pasar gif cuando se le da a las flechas
	 * @param arrGifs - lista de gifs - type: Array
	 * @param direction - direccion de la flecha al pasar el gif (true: izquierda, false: derecha) - type: Boolean
	 */
	reloadGifFullScreen(arrGifs, direction) {
		if (direction) {
			if (positionGif == 0) {
				positionGif = arrGifs.length - 1;
			} else {
				positionGif--;
			}
		} else {
			if (positionGif == arrGifs.length - 1) {
				positionGif = 0;
			} else {
				positionGif++;
			}
		}

		// Pintar la info del gif
		const gifsFav = api.getAllFavoritesLocal();
		const iconFav = gifsFav.some((fav) => fav.id === arrGifs[positionGif].id) ? 'heart' : 'heart-outline';
		modal.innerHTML = this.maskGifFullScreen(arrGifs[positionGif], iconFav);
		this.addEventChangeGif(arrGifs);
		this.addEventFavorites([arrGifs[positionGif].id]);
		this.addEventDownloadGif([arrGifs[positionGif].id]);
	},
	/**
	 * @description Cerrar modal del gif
	 */
	closeModal() {
		document.body.style.overflow = 'auto';
		document.querySelector('#modal').classList.add('modal-closed');
	},
	/**
	 * @description Eliminar objeto de un array
	 * @param array - Array de objetos el cual se le eliminara el item - type: Array
	 * @param id - item a buscar en el array - type: String | Number
	 */
	removeItemObjFromArr(arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
