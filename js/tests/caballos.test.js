// tests/caballos.test.js
import { createCaballo, deleteCaballo, createPedigri, deletePedigri } from "../caballoService.js";
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
      nombre: "Almond Eye",
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
    expect(caballo.nombre).toBe("Almond Eye");

    caballoId = caballo.id;
  });

  test("Crear un pedigrí", async () => {
    const padre = await createCaballo({
      nombre: "King Kamehameha",
      descripcion: "Padre de prueba",
      descripcion_larga: "Caballo ascendiente para pruebas unitarias",
      color: "negro",
      sexo: "semental",
      fecha_nacimiento: "2001-01-01",
      fecha_retiramiento: null,
      fecha_fallecimiento: null,
      duenyo: "Criador Test",
      entrenador: "Entrenador Padre",
      hogar: "Rancho Padre"
    });
    ascendienteId = padre.id;

    const pedigri = await createPedigri({
      id_caballo: caballoId,
      id_ascendiente: ascendienteId,
      nombre_ascendiente: "King Kamehameha",
      tipo_relacion: "padre"
    });

    expect(pedigri).toHaveProperty("id");
    expect(pedigri.id_caballo).toBe(caballoId);
    expect(pedigri.id_ascendiente).toBe(ascendienteId);
    expect(pedigri.tipo_relacion).toBe("padre");

    pedigriId = pedigri.id;
  });

  test("Eliminar pedigrí", async () => {
    const result = await deletePedigri(pedigriId);
    expect(result).toBe(true);
  });

  test("Eliminar un caballo", async () => {
    const result = await deleteCaballo(caballoId);
    expect(result).toBe(true);
    const result2 = await deleteCaballo(ascendienteId);
    expect(result2).toBe(true);
  });
});

// Cerrar sesión al terminar (buena práctica con PocketBase)
afterAll(() => {
  pb.authStore.clear();
});
