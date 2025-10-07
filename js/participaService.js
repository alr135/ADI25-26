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


/**
 * Obtener todas las participaciones
 * @returns {Array} Lista de todas las participaciones
 */
export async function getAllParticipaciones() {
  try {
	const participaciones = await pb.collection("participaciones").getFullList(200);
	return participaciones;
  } catch (err) {
	console.error("Error al obtener la lista de participaciones:", err);
	throw err;
  }
}

/** Obtener la lista de participaciones, opcionalmente filtrando por id_caballo o id_carrera
 * @param {string} [id_caballo] - ID del caballo para filtrar participaciones (opcional)
 * @param {string} [id_carrera] - ID de la carrera para filtrar participaciones (opcional)
 * @returns {Array} Lista de participaciones filtradas
 */
export async function getParticipaciones(id_caballo, id_carrera) {
  try {
    const filter = [];
    if (id_caballo) {
      filter.push(`id_caballo="${id_caballo}"`);
    }
    if (id_carrera) {
      filter.push(`id_carrera="${id_carrera}"`);
    }

    const participaciones = await pb.collection("participaciones").getFullList(200, {
      filter: filter.join(" && "),
    });
    return participaciones;
  } catch (err) {
    console.error("Error al obtener participaciones:", err);
    throw err;
  }
}

/**
 * Edita una participación por id
 * @param {string} id - ID de la participación a editar
 * @param {Object} datos - Datos a actualizar { id_caballo?, id_carrera?, posicion?, jinete? }
 * @returns {Object} Participación actualizada
 */
export async function editParticipacion(id, datos) {
  try {
	if (!id) {
	  throw new Error("Debes proporcionar un ID de participación para editar");
	}

	if(!datos || !datos.id_caballo || !datos.id_carrera || !datos.posicion || !datos.jinete ) {
		throw new Error("Datos incompletos para editar la participación");
	}

	const payload = {
	  id_caballo: datos.id_caballo,
	  id_carrera: datos.id_carrera,
	  posicion: datos.posicion,
	  jinete: datos.jinete ?? "-",
	}

	const updatedParticipacion = await pb.collection("participaciones").update(id, payload);
	return updatedParticipacion;
  } catch (err) {
	console.error("Error al editar participación:", err);
	throw err;
  }
}
