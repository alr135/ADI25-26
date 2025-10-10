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
