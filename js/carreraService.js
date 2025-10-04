import { pb } from "./pb.js";

/**
 * Crear una carrera (independiente de caballo)
 * @param {Object} carrera - { nombre, fecha, distancia, condiciones?, lugar}
 */

export async function createCarrera(carrera) {
  try {
	if (!carrera?.nombre || !carrera?.fecha || !carrera?.distancia || !carrera?.lugar) {
	  throw new Error("Debes pasar al menos nombre, fecha, distancia y lugar");
	}
	const payload = {
	  nombre: carrera.nombre,
	  fecha: carrera.fecha,
	  distancia: carrera.distancia,
	  condiciones: carrera.condiciones ?? "-",
	  lugar: carrera.lugar,
	};

	const nuevaCarrera = await pb.collection("carreras").create(payload);
	return nuevaCarrera;
  } catch (err) {
	console.error("Error al crear carrera:", err);
	throw err;
  }
}