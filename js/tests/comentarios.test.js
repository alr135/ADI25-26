import { createComentario, deleteComentario, getAllComentarios, editComentario } from "../comentarioService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Comentarios Service", () => {
  let comentarioId = null;
  let noticiaId = null;

  beforeAll(async () => {
  	// Crear un usuario normal
    const user = await pb.collection("users").create({
      email: "comentario_tester@example.com",
      password: "12345678",
      passwordConfirm: "12345678",
      
    });
    userId = user.id;
    // Crear primero una noticia de prueba porque comentario depende de ella
    const noticia = await pb.collection("noticias").create({
      titulo: "Noticia de prueba",
      contenido: "Contenido de noticia de prueba para comentarios",
      fecha: new Date().toISOString()
    });
    noticiaId = noticia.id;
  });

  afterAll(async () => {
    // Borrar la noticia de prueba
    if (noticiaId) {
      await pb.collection("noticias").delete(noticiaId);
    }
    // Borrar el usuario de prueba
    if (userId) {
      await pb.collection("users").delete(userId);
    }
  });

  test("Crear un comentario", async () => {
    const comentario = await createComentario({
      contenido: "Este es un comentario de prueba",
      id_noticia: noticiaId,
	    uid_usuario: userId
    });

    expect(comentario).toHaveProperty("id");
    expect(comentario.contenido).toBe("Este es un comentario de prueba");
    expect(comentario.id_noticia).toBe(noticiaId);

    comentarioId = comentario.id;
  });

  test("Obtener lista de comentarios", async () => {
    const comentarios = await getAllComentarios(noticiaId);
    expect(Array.isArray(comentarios)).toBe(true);
    expect(comentarios.length).toBeGreaterThan(0);
  });

  test("Editar un comentario", async () => {
    const comentarioEditado = await editComentario(comentarioId, {
      contenido: "Comentario editado en prueba",
      id_noticia: noticiaId,
      uid_usuario: userId
    });
    expect(comentarioEditado).toHaveProperty("id");
    expect(comentarioEditado.contenido).toBe("Comentario editado en prueba");
  });

  test("Eliminar un comentario", async () => {
    const result = await deleteComentario(comentarioId);
    expect(result).toBe(true);
  });
});
