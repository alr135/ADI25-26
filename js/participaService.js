import { pb } from "./pb.js";

/** Crear una participación (un caballo en una carrera)
 * @param {Object} participacion - { id_caballo, id_carrera, posicion, jinete? }
 */

export async function createParticipacion(participacion) {
  try {
	if (!participacion?.id_caballo || !participacion?.id_carrera || !participacion?.posicion) {
	  throw new Error("Debes pasar al menos id_caballo, id_carrera y posicion");
	}
	const payload = {
	  id_caballo: participacion.id_caballo,
	  id_carrera: participacion.id_carrera,
	  posicion: participacion.posicion,
	  jinete: participacion.jinete ?? "-",
	};

	const nuevaParticipacion = await pb.collection("participaciones").create(payload);
	return nuevaParticipacion;
  } catch (err) {
	console.error("Error al crear participación:", err);
	throw err;
  }
}

/**
 * Eliminar una participación por id
 */
export async function deleteParticipacion(id) {
  try {
    await pb.collection("participaciones").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar participación:", err);
    throw err;
  }
}
