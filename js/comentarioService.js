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
