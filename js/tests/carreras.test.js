import { createCarrera, deleteCarrera } from "../carreraService.js";
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

  test("Eliminar una carrera", async () => {
    const result = await deleteCarrera(carreraId);
    expect(result).toBe(true);
  });
});
