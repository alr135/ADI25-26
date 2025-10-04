// noticiasService.js
import { pb } from "./pb.js";

/**
 * Crear una nueva noticia
 * @param {Object} noticia - Objeto con los datos de la noticia
 * @param {Object} noticiaCaballo - Objeto con los datos de la noticia
 */
export async function createNoticia(noticia) {
  try {
    const newNoticia = await pb.collection("noticias").create({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      fecha: noticia.fecha || new Date().toISOString(),
      url_video: noticia.url_video,
    });
    return newNoticia;
  } catch (err) {
    console.error("Error al crear noticia:", err);
    throw err;
  }
}

export async function createNoticiaCaballo(noticiaCaballo) {
  try {
    const newNoticiaCaballo = await pb.collection("noticia_caballo").create({
      id_noticia: noticiaCaballo.idNoticia,
      id_caballo: noticiaCaballo.idCaballo,
    });
    return newNoticiaCaballo;
  } catch (err) {
    console.error("Error al crear entrada en NOTICIA_CABALLO:", err);
    throw err;
  }
}

/**
 * Eliminar una noticia por id
 */
export async function deleteNoticia(id) {
  try {
    await pb.collection("noticias").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar noticia:", err);
    throw err;
  }
}

/**
 * Eliminar una relación noticia-caballo por id
 */
export async function deleteNoticiaCaballo(id) {
  try {
    await pb.collection("noticia_caballo").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar noticia_caballo:", err);
    throw err;
  }
}
