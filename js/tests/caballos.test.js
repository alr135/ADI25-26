// tests/caballos.test.js
import { createCaballo, deleteCaballo } from "../caballoService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Caballos Service", () => {
  let caballoId = null;

  test("Crear un caballo", async () => {
    const caballo = await createCaballo({
      nombre: "TestCaballo",
      descripcion: "Caballo de prueba",
      descripcion_larga: "Un caballo creado en pruebas unitarias",
      color: "alazán",
      sexo: "yegua",
      fecha_nacimiento: "2020-01-01",
      fecha_retiramiento: null,
      fecha_fallecimiento: null,
      duenyo: "Tester",
      entrenador: "Entrenador Test",
      hogar: "Rancho Test"
    });

    expect(caballo).toHaveProperty("id");
    expect(caballo.nombre).toBe("TestCaballo");

    caballoId = caballo.id;
  });

  test("Eliminar un caballo", async () => {
    const result = await deleteCaballo(caballoId);
    expect(result).toBe(true);
  });
});

// Cerrar sesión al terminar (buena práctica con PocketBase)
afterAll(() => {
  pb.authStore.clear();
});
