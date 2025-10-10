import { createImagen, deleteImagen, createImagenNoticia, deleteImagenNoticia } from "../imagenService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Imagenes Service", () => {
  let imagenId = null;
  let imagenNoticiaId = null;
  let caballoId = null;
  let noticiaId = null;

  // Crear recursos necesarios para las pruebas
  beforeAll(async () => {
    // Crear un caballo de prueba para las imágenes
    const caballo = await pb.collection("caballos").create({
      nombre: "Caballo Test Imagen",
      descripcion: "Caballo para pruebas de imágenes",
      descripcion_larga: "Caballo creado específicamente para testing de servicio de imágenes",
      color: "bayo",
      sexo: "semental",
      fecha_nacimiento: "2018-05-15"
    });
    caballoId = caballo.id;

    // Crear una noticia de prueba para imágenes de noticias
    const noticia = await pb.collection("noticias").create({
      titulo: "Noticia Test Imagen",
      contenido: "Contenido de noticia para pruebas de imágenes",
      fecha: new Date().toISOString()
    });
    noticiaId = noticia.id;
  });

  // Limpiar recursos después de las pruebas
  afterAll(async () => {
    if (caballoId) {
      await pb.collection("caballos").delete(caballoId);
    }
    if (noticiaId) {
      await pb.collection("noticias").delete(noticiaId);
    }
  });

  test("Crear una imagen para caballo", async () => {
    const imagen = await createImagen({
      id_caballo: caballoId,
      url: new File([""], "test-image.jpg", { type: "image/jpeg" }),
      descripcion: "Imagen de prueba del caballo",
      fecha_subida: "2024-01-15T10:30:00.000Z"
    });

    expect(imagen).toHaveProperty("id");
    expect(imagen.id_caballo).toBe(caballoId);
    expect(imagen).toHaveProperty("url");
    expect(imagen.descripcion).toBe("Imagen de prueba del caballo");

    imagenId = imagen.id;
  });

  test("Crear una imagen para noticia", async () => {
    const imagenNoticia = await createImagenNoticia({
      id_noticia: noticiaId,
      url: new File([""], "test-image.jpg", { type: "image/jpeg" }),
      tipo: "principal",
      descripcion: "Imagen principal de la noticia"
    });

    expect(imagenNoticia).toHaveProperty("id");
    expect(imagenNoticia.id_noticia).toBe(noticiaId);
    expect(imagenNoticia).toHaveProperty("url");
    expect(imagenNoticia.tipo).toBe("principal");
    expect(imagenNoticia.descripcion).toBe("Imagen principal de la noticia");

    imagenNoticiaId = imagenNoticia.id;
  });

  test("Crear imagen para noticia con tipo por defecto", async () => {
    const imagenNoticia = await createImagenNoticia({
      id_noticia: noticiaId,
      url: new File([""], "test-image.jpg", { type: "image/jpeg" }),
    });

    expect(imagenNoticia).toHaveProperty("id");
    expect(imagenNoticia.tipo).toBe("secundaria"); // Valor por defecto
    expect(imagenNoticia.descripcion).toBe(""); // Valor por defecto

    // Limpiar esta imagen secundaria
    await deleteImagenNoticia(imagenNoticia.id);
  });

  test("Error al crear imagen sin id_caballo y url", async () => {
    await expect(createImagen({}))
      .rejects
      .toThrow("Debes pasar al menos id_caballo y url");
  });

  test("Eliminar una imagen de caballo", async () => {
    const result = await deleteImagen(imagenId);
    expect(result).toBe(true);
  });

  test("Eliminar una imagen de noticia", async () => {
    const result = await deleteImagenNoticia(imagenNoticiaId);
    expect(result).toBe(true);
  });
});