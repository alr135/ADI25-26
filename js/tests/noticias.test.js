import { createNoticia, createNoticiaCaballo, deleteNoticia, deleteNoticiaCaballo, getListaNoticias, getNoticiaByTitulo, updateNoticia } from "../noticiaService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Noticias Service", () => {
  let noticiaId = null;
  let noticiaCaballoId = null;
  let caballoId = null;

  // Crear recursos necesarios para las pruebas
  beforeAll(async () => {
    // Crear un caballo de prueba para la relación noticia_caballo
    const caballo = await pb.collection("caballos").create({
      nombre: "Caballo Test Noticia",
      descripcion: "Caballo para pruebas de noticias",
      descripcion_larga: "Caballo creado específicamente para testing de servicio de noticias",
      color: "negro",
      sexo: "yegua",
      fecha_nacimiento: "2019-03-10"
    });
    caballoId = caballo.id;
  });

  // Limpiar recursos después de las pruebas
  afterAll(async () => {
    if (caballoId) {
      await pb.collection("caballos").delete(caballoId);
    }
  });

  test("Crear una noticia", async () => {
    const noticia = await createNoticia({
      titulo: "Noticia de prueba",
      contenido: "Contenido de la noticia de prueba",
      fecha: "2024-01-20T10:00:00.000Z",
      url_video: "https://youtube.com/embed/video123"
    });

    expect(noticia).toHaveProperty("id");
    expect(noticia.titulo).toBe("Noticia de prueba");
    expect(noticia.contenido).toBe("Contenido de la noticia de prueba");
    expect(noticia.url_video).toBe("https://youtube.com/embed/video123");

    noticiaId = noticia.id;
  });

  test("Crear una relación noticia-caballo", async () => {
    // Asegurarse de que tenemos una noticia y un caballo
    expect(noticiaId).toBeDefined();
    expect(caballoId).toBeDefined();

    const noticiaCaballo = await createNoticiaCaballo({
      idNoticia: noticiaId,
      idCaballo: caballoId
    });

    expect(noticiaCaballo).toHaveProperty("id");
    expect(noticiaCaballo.id_noticia).toBe(noticiaId);
    expect(noticiaCaballo.id_caballo).toBe(caballoId);

    noticiaCaballoId = noticiaCaballo.id;
  });

  test("Obtener lista de noticias", async () => {
    const noticias = await getListaNoticias();
    
    expect(Array.isArray(noticias)).toBe(true);
    expect(noticias.length).toBeGreaterThan(0);
    expect(noticias[0]).toHaveProperty("titulo");
    expect(noticias[0]).toHaveProperty("contenido");
  });

  test("Buscar noticia por título", async () => {
    const noticias = await getNoticiaByTitulo("prueba");
    
    expect(Array.isArray(noticias)).toBe(true);
    expect(noticias.length).toBeGreaterThan(0);
    expect(noticias[0].titulo.toLowerCase()).toContain("prueba");
  });

  test("Actualizar una noticia", async () => {
    const noticiaActualizada = await updateNoticia(noticiaId, {
      titulo: "Noticia actualizada",
      contenido: "Contenido actualizado de la noticia",
      url_video: "https://youtube.com/embed/video456"
    });

    expect(noticiaActualizada.titulo).toBe("Noticia actualizada");
    expect(noticiaActualizada.contenido).toBe("Contenido actualizado de la noticia");
    expect(noticiaActualizada.url_video).toBe("https://youtube.com/embed/video456");
  });

  test("Eliminar una relación noticia-caballo", async () => {
    const result = await deleteNoticiaCaballo(noticiaCaballoId);
    expect(result).toBe(true);
  });

  test("Eliminar una noticia", async () => {
    const result = await deleteNoticia(noticiaId);
    expect(result).toBe(true);
  });
});