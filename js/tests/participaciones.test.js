import { createParticipacion, deleteParticipacion, getAllParticipaciones, getParticipaciones, editParticipacion } from "../participaService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("Participaciones Service", () => {
  let participacionId = null;
  let caballoId = null;
  let carreraId = null;

  // Crear recursos necesarios para las pruebas
  beforeAll(async () => {
    // Crear un caballo de prueba
    const caballo = await pb.collection("caballos").create({
      nombre: "Caballo Test Participación",
      descripcion: "Caballo para pruebas de participaciones",
      descripcion_larga: "Caballo creado específicamente para testing de servicio de participaciones",
      color: "castaño",
      sexo: "semental",
      fecha_nacimiento: "2017-08-20"
    });
    caballoId = caballo.id;

    // Crear una carrera de prueba
    const carrera = await pb.collection("carreras").create({
      nombre: "Carrera Test Participación",
      fecha: "2024-02-15",
      distancia: "2000m",
      condiciones: "Suelo blando",
      lugar: "Hipódromo Test"
    });
    carreraId = carrera.id;
  });

  // Limpiar recursos después de las pruebas
  afterAll(async () => {
    if (caballoId) {
      await pb.collection("caballos").delete(caballoId);
    }
    if (carreraId) {
      await pb.collection("carreras").delete(carreraId);
    }
  });

  test("Crear una participación", async () => {
    const participacion = await createParticipacion({
      id_caballo: caballoId,
      id_carrera: carreraId,
      posicion: 1,
      jinete: "Jinete de Prueba"
    });

    expect(participacion).toHaveProperty("id");
    expect(participacion.id_caballo).toBe(caballoId);
    expect(participacion.id_carrera).toBe(carreraId);
    expect(participacion.posicion).toBe(1);
    expect(participacion.jinete).toBe("Jinete de Prueba");

    participacionId = participacion.id;
  });

  test("Crear una participación con jinete por defecto", async () => {
    const participacion = await createParticipacion({
      id_caballo: caballoId,
      id_carrera: carreraId,
      posicion: 2
      // No pasamos jinete, debería usar el valor por defecto "-"
    });

    expect(participacion).toHaveProperty("id");
    expect(participacion.posicion).toBe(2);
    expect(participacion.jinete).toBe("-"); // Valor por defecto

    // Limpiar esta participación adicional
    await deleteParticipacion(participacion.id);
  });

  test("Error al crear participación sin id_caballo", async () => {
    await expect(createParticipacion({
      id_carrera: carreraId,
      posicion: 1
    })).rejects.toThrow("Debes pasar al menos id_caballo, id_carrera y posicion");
  });

  test("Error al crear participación sin id_carrera", async () => {
    await expect(createParticipacion({
      id_caballo: caballoId,
      posicion: 1
    })).rejects.toThrow("Debes pasar al menos id_caballo, id_carrera y posicion");
  });

  test("Error al crear participación sin posicion", async () => {
    await expect(createParticipacion({
      id_caballo: caballoId,
      id_carrera: carreraId
    })).rejects.toThrow("Debes pasar al menos id_caballo, id_carrera y posicion");
  });

  test("Obtener todas las participaciones", async () => {
    const participaciones = await getAllParticipaciones();
    expect(Array.isArray(participaciones)).toBe(true);
    expect(participaciones.length).toBeGreaterThan(0);
  });

  test("Obtener participaciones filtrando por id_caballo", async () => {
    const participaciones = await getParticipaciones(caballoId, null);
    expect(Array.isArray(participaciones)).toBe(true);
    expect(participaciones.length).toBeGreaterThan(0); 
    participaciones.forEach(p => {
      expect(p.id_caballo).toBe(caballoId);
    });
  });

  test("Obtener participaciones filtrando por id_carrera", async () => {
    const participaciones = await getParticipaciones(null, carreraId);
    expect(Array.isArray(participaciones)).toBe(true);
    expect(participaciones.length).toBeGreaterThan(0);  
    participaciones.forEach(p => {
      expect(p.id_carrera).toBe(carreraId);
    });
  });

  test("Editar una participación", async () => {
    const updatedData = {
      posicion: 3,
      id_caballo: caballoId,
      id_carrera: carreraId,
      jinete: "Jinete Actualizado"
    };
    const updatedParticipacion = await editParticipacion(participacionId, updatedData);
    expect(updatedParticipacion.posicion).toBe(3);
    expect(updatedParticipacion.jinete).toBe("Jinete Actualizado");
  });

  test("Eliminar una participación", async () => {
    const result = await deleteParticipacion(participacionId);
    expect(result).toBe(true);
  });
});