import { pb } from "./pb.js";

/**
 * Crear una imagen para un caballo
 * @param {Object} imagen - { id_caballo, url, descripcion?, fecha_subida? }
 * @param {Object} imagenNoticia - { id_noticia, url, descripcion?, tipo(principal/secundaria)? }
 */
export async function createImagen(imagen) {
  try {
    if (!imagen?.id_caballo || !imagen?.url) {
      throw new Error("Debes pasar al menos id_caballo y url");
    }

    const payload = {
      id_caballo: imagen.id_caballo,
      url: imagen.url,
      descripcion: imagen.descripcion ?? "",
      fecha_subida: imagen.fecha_subida ?? new Date().toISOString(),
    };

    const nuevaImagen = await pb.collection("imagenes").create(payload);
    return nuevaImagen;
  } catch (err) {
    console.error("Error al crear imagen:", err);
    throw err;
  }
}

export async function createImagenNoticia(imagenNoticia) {
  const payload = {
    id_noticia: imagenNoticia.id_noticia,
    url: imagenNoticia.url,
    tipo: imagenNoticia.tipo ?? "secundaria",
    descripcion: imagenNoticia.descripcion ?? "",
  };
  return pb.collection("imagenes_noticias").create(payload);
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
