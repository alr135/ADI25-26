import { pb } from "./pb.js";

/**
 * Crear una imagen para un caballo
 * @param {Object} imagen - { id_caballo, url (File), descripcion?, fecha_subida? }
 */
export async function createImagen(imagen) {
  try {
    if (!imagen?.id_caballo || !imagen?.url) {
      throw new Error("Debes pasar al menos id_caballo y url (File)");
    }

    // Usar FormData para enviar archivos (url es tipo file)
    const formData = new FormData();
    formData.append('id_caballo', imagen.id_caballo);
    formData.append('url', imagen.url);
    formData.append('descripcion', imagen.descripcion ?? "");
    formData.append('fecha_subida', imagen.fecha_subida ?? new Date().toISOString());

    const nuevaImagen = await pb.collection("imagenes").create(formData);
    return nuevaImagen;
  } catch (err) {
    console.error("Error al crear imagen:", err.response?.data || err);
    throw err;
  }
}

/**
 * Crear una imagen para noticia
 * @param {Object} imagenNoticia - { id_noticia, url (File), descripcion?, tipo? }
 */
export async function createImagenNoticia(imagenNoticia) {
  try {
    if (!imagenNoticia?.id_noticia || !imagenNoticia?.url) {
      throw new Error("Debes pasar al menos id_noticia y url (File)");
    }

    const formData = new FormData();
    formData.append('id_noticia', imagenNoticia.id_noticia);
    formData.append('url', imagenNoticia.url);
    formData.append('tipo', imagenNoticia.tipo ?? "secundaria");
    formData.append('descripcion', imagenNoticia.descripcion ?? "");

    const nuevaImagenNoticia = await pb.collection("imagenes_noticias").create(formData);
    return nuevaImagenNoticia;
  } catch (err) {
    console.error("Error al crear imagen de noticia:", err.response?.data || err);
    throw err;
  }
}


/**
 * Eliminar una imagen de caballo por id
 */
export async function deleteImagen(id) {
  try {
    await pb.collection("imagenes").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar imagen:", err);
    throw err;
  }
}

/**
 * Eliminar una imagen de noticia por id
 */
export async function deleteImagenNoticia(id) {
  try {
    await pb.collection("imagenes_noticias").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar imagen de noticia:", err);
    throw err;
  }
}


/** * Obtener la lista de imágenes de un caballo
 * @param {string} id_caballo - ID del caballo para filtrar imágenes
 * @returns {Array} Lista de imágenes ordenadas por fecha de subida descendente
 */
export async function getImagenesPorCaballo(id_caballo) {
  try {
    const imagenes = await pb.collection("imagenes").getFullList(200, {
      filter: `id_caballo="${id_caballo}"`,
      sort: "-fecha_subida",
    });
    return imagenes;
  } catch (err) {
    console.error("Error al obtener imágenes de caballo:", err);
    throw err;
  }
}

/**
 * Obtener la lista de imágenes de una noticia
 * @param {string} id_noticia - ID de la noticia para filtrar imágenes
 * @returns {Array} Lista de imágenes ordenadas por tipo (principal primero)
 */
export async function getImagenesPorNoticia(id_noticia) {
  try {
    const imagenes = await pb.collection("imagenes_noticias").getFullList(200, {
      filter: `id_noticia="${id_noticia}"`,
      sort: "-tipo",
    });
    return imagenes;
  } catch (err) {
    console.error("Error al obtener imágenes de noticia:", err);
    throw err;
  }
}

/**
 * Obtener la lista de todas las imágenes de los caballos (sin filtro)
 * @returns {Array} Lista de todas las imágenes ordenadas por fecha de subida descendente
 */
export async function getAllHorseImagenes() {
  try {
    const imagenes = await pb.collection("imagenes").getFullList(200, {
      sort: "-fecha_subida",
    });
    return imagenes;
  } catch (err) {
    console.error("Error al obtener todas las imágenes de caballos:", err);
    throw err;
  }
}

/** * Obtener la lista de todas las imágenes de las noticias (sin filtro)
 * @returns {Array} Lista de todas las imágenes ordenadas por tipo (principal primero)
 */
export async function getAllNewsImagenes() {
  try {
    const imagenes = await pb.collection("imagenes_noticias").getFullList(200, {
      sort: "-tipo",
    });
    return imagenes;
  } catch (err) {
    console.error("Error al obtener todas las imágenes de noticias:", err);
    throw err;
  }
}

/**
 * Edita una imagen de un caballo existente a partir de su id
 * @param {string} id - ID de la imagen a editar
 * @param {Object} imagen - Objeto con los datos actualizados de la imagen
 */
export async function updateHorseImagen(id, imagen) {
  try {
    if(!id) {
      throw new Error("Debes pasar el id de la imagen a editar");
    }
    
    const updatedImagen = await pb.collection("imagenes").update(id, {
      url: imagen.url,
      descripcion: imagen.descripcion ?? "",
      fecha_subida: imagen.fecha_subida ?? new Date().toISOString(),
    });
    return updatedImagen;
  } catch (err) {
    console.error("Error al actualizar imagen:", err);
    throw err;
  }
}

/**
 * Edita una imagen de una noticia existente a partir de su id
 * @param {string} id - ID de la imagen a editar
 * @param {Object} imagenNoticia - Objeto con los datos actualizados de la imagen de noticia
 * @returns {Object} La imagen de noticia actualizada
 */
export async function updateNewsImagen(id, imagenNoticia) {
  try {
    if(!id) {
      throw new Error("Debes pasar el id de la imagen de noticia a editar");
    }

    const updatedImagenNoticia = await pb.collection("imagenes_noticias").update(id, {
      url: imagenNoticia.url,
      descripcion: imagenNoticia.descripcion ?? "",
      fecha_subida: imagenNoticia.fecha_subida ?? new Date().toISOString(),
      tipo: imagenNoticia.tipo ?? "secundaria",
    });
    return updatedImagenNoticia;
  } catch (err) {
    console.error("Error al actualizar imagen de noticia:", err);
    throw err;
  }
}
