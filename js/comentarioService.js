import { pb } from "./pb.js";

/**
 * Crear un comentario
 * @param {Object} comentario - { contenido, id_noticia, fecha?, uid_usuario? }
 * @returns {Promise<Object>} -> registro creado
 */
export async function createComentario(comentario) {
  try {
    // Validaciones básicas
    if (!comentario || typeof comentario !== "object") {
      throw new Error("createComentario: debes pasar un objeto { contenido, id_noticia, ... }");
    }

    const { contenido, id_noticia } = comentario;

    if (!contenido || typeof contenido !== "string" || !contenido.trim()) {
      throw new Error("El campo 'contenido' es obligatorio y no puede estar vacío.");
    }

    if (!id_noticia || typeof id_noticia !== "string") {
      throw new Error("El campo 'id_noticia' (ID de la noticia) es obligatorio.");
    }

    // Determinar uid_usuario:
    // - si viene en el objeto (p. ej. admin creando en nombre de otro)
    // - si no, intentar obtenerlo del usuario autenticado
    let uid_usuario = comentario.uid_usuario;
    if (!uid_usuario) {
      const user = pb.authStore.model;
      // Algunos proyectos usan user.id (id generado por PocketBase),
      // otros pueden tener un campo 'uid' en el registro; comprobamos ambos.
      uid_usuario = user?.id ?? user?.uid;
      if (!uid_usuario) {
        throw new Error("No hay usuario autenticado. Inicia sesión o pasa 'uid_usuario' explícitamente.");
      }
    }

    // Montar payload con campos esperados por la colección
    const payload = {
      contenido: contenido.trim(),
      fecha: comentario.fecha ?? new Date().toISOString(),
      uid_usuario,
      id_noticia,
    };

    const nuevoComentario = await pb.collection("comentarios").create(payload);
    return nuevoComentario;
  } catch (err) {
    console.error("Error en createComentario:", err);
    throw err;
  }
}

/**
 * Eliminar un comentario por id
 */
export async function deleteComentario(id) {
  try {
    await pb.collection("comentarios").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    throw err;
  }
}

/**
 * Obtener la lista de comentarios, opcionalmente filtrando por id_noticia
 * @param {string} [id_noticia] - ID de la noticia para filtrar comentarios (opcional)
 * @returns {Array} Lista de comentarios ordenados por fecha descendente
 */
export async function getListaComentarios(id_noticia) {
  try {
    const filter = id_noticia ? { id_noticia } : {};
    const comentarios = await pb.collection("comentarios").getFullList(200, {
      filter,
      sort: "-fecha",
    });
    return comentarios;
  } catch (err) {
    console.error("Error al obtener la lista de comentarios:", err);
    throw err;
  }
}

/**
 * Obtener la lista de todos los comentarios (sin filtro)
 * @returns {Array} Lista de todos los comentarios ordenados por fecha descendente
 */
export async function getAllComentarios() {
  try {
    const comentarios = await pb.collection("comentarios").getFullList(200, {
      sort: "-fecha",
    });
    return comentarios;
  } catch (err) {
    console.error("Error al obtener la lista de todos los comentarios:", err);
    throw err;
  }
}

/**
 * Editar un comentario por id y un objeto con los campos a modificar
 * @param {string} id - ID del comentario a editar
 * @param {Object} updatedComment - Objeto con los campos a actualizar (e.g., { contenido, fecha })
 * @returns {Object} Comentario editado
 */
export async function editComentario(id, updatedComment) {
  try {
    if (!id) {
      throw new Error("El ID del comentario es obligatorio para editar.");
    }
    if (!updatedComment || !updatedComment.contenido || !updatedComment.id_noticia || !updatedComment.uid_usuario) {
      throw new Error("Debes proporcionar todos los campos del comentario a editar.");
    }else{
      const payload = {
        contenido: updatedComment.contenido,
        fecha: updatedComment.fecha ?? new Date().toISOString(),    //Fecha actual si no se proporciona
        id_noticia: updatedComment.id_noticia,
        uid_usuario: updatedComment.uid_usuario
      };
      const comentarioEditado = await pb.collection("comentarios").update(id, payload);
      return comentarioEditado;
    }
    
  } catch (err) {
    console.error("Error al editar comentario:", err);
    throw err;
  }
}