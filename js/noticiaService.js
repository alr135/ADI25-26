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

/**
 * Obtener la lista de noticias
 * @returns {Array} Lista de noticias ordenadas por fecha de creación descendente
 */
export async function getListaNoticias() {
  try {
    const noticias = await pb.collection("noticias").getFullList(200, {
      sort: "-created",
    });
    return noticias;
  } catch (err) {
    console.error("Error al obtener la lista de noticias:", err);
    throw err;
  }
}

/** Obtener una noticia por su título o una parte de este
 * @param {string} titulo - Título o parte del título de la noticia
 * @returns {Array} Lista de noticias que coinciden con el título proporcionado
 */
export async function getNoticiaByTitulo(titulo) {
  try {
    const noticias = await pb.collection("noticias").getFullList(200, {
      filter: `titulo~"${titulo}"`,
    });
    return noticias;
  } catch (err) {
    console.error("Error al obtener noticias:", err);
    throw err;
  }
}

/** 
 * Editar una noticia por id
 * @param {string} id - ID de la noticia a editar
 * @param {Object} noticia - Objeto con los datos actualizados de la noticia
 * @return {Object} La noticia actualizada
 */
export async function updateNoticia(id, noticia) {
  try {
    const updatedNoticia = await pb.collection("noticias").update(id, {
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      fecha: noticia.fecha || new Date().toISOString(),
      url_video: noticia.url_video,
    });
    return updatedNoticia;
  } catch (err) {
    console.error("Error al actualizar noticia:", err);
    throw err;
  }
}
