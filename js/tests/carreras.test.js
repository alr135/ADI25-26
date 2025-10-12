import { createCarrera, deleteCarrera, getCarreraByText, getListaCarreras, editCarrera } from "../carreraService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Carreras Service", () => {
  let carreraId = null;

  test("Crear una carrera", async () => {
    const carrera = await createCarrera({
      nombre: "Arima Kinen",
      fecha: "2025-10-09",
      distancia: "2500m",
      condiciones: "Suelo firme",
      lugar: "Nakayama"
    });

    expect(carrera).toHaveProperty("id");
    expect(carrera.nombre).toBe("Arima Kinen");
    expect(carrera.distancia).toBe("2500m");

    carreraId = carrera.id;
  });

  test("Obtener lista de carreras", async () => {
    const carreras = await getListaCarreras();
    expect(Array.isArray(carreras)).toBe(true);
    expect(carreras.length).toBeGreaterThan(0);
  });

  test("Buscar carrera por texto", async () => {
    const carreras = await getCarreraByText("Arima");
    expect(Array.isArray(carreras)).toBe(true);
    expect(carreras.length).toBeGreaterThan(0);
    expect(carreras[0].nombre).toContain("Arima");
  });

  test("Editar una carrera", async () => {
    const carreraEditada = await editCarrera(carreraId, {
      nombre: "Arima Kinen - Edición",
      fecha: "2025-10-10",
      distancia: "2500m",
      lugar: "Nakayama",
      condiciones: "Suelo blando"
    });
    expect(carreraEditada).toHaveProperty("id");
    expect(carreraEditada.condiciones).toBe("Suelo blando");
  });

  test("Eliminar una carrera", async () => {
    const result = await deleteCarrera(carreraId);
    expect(result).toBe(true);
  });
});
