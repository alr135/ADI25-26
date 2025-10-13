// tests/caballos.test.js
import { createCaballo, deleteCaballo, createPedigri, deletePedigri, getListaCaballos, getCaballoByText, updateCaballo } from "../caballoService.js";
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

  test("Actualizar un caballo", async () => {
    const updatedCaballo = await updateCaballo(caballoId, {
      nombre: "Almond Eye actualizada",
      descripcion_larga: "Descripción larga actualizada",
      descripcion: "Caballo de prueba actualizado",
      color: "castaño",
      sexo: "yegua",
      fecha_nacimiento: "2020-01-01",
      fecha_retiramiento: null,
      fecha_fallecimiento: null,
      duenyo: "Tester Actualizado",
      entrenador: "Entrenador Test Actualizado",
      hogar: "Rancho Actualizado"
    });
    expect(updatedCaballo.descripcion).toBe("Caballo de prueba actualizado");
    expect(updatedCaballo.hogar).toBe("Rancho Actualizado");
  });

  test("Obtener lista de caballos", async () => {
    const caballos = await getListaCaballos();
    expect(Array.isArray(caballos)).toBe(true);
    expect(caballos.length).toBeGreaterThan(0);
  });

  test("Buscar caballo por texto", async () => {
    const resultados = await getCaballoByText("Almond");
    expect(Array.isArray(resultados)).toBe(true);
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados[0].nombre).toBe("Almond Eye actualizada");
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
