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

/**
 * Eliminar una carrera por id
 */
export async function deleteCarrera(id) {
  try {
    await pb.collection("carreras").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar carrera:", err);
    throw err;
  }
}

/**
 * Obtener la lista de carreras
 * @returns {Array} Lista de carreras ordenadas por fecha descendente
 */
export async function getListaCarreras() {
  try {
    const carreras = await pb.collection("carreras").getFullList(200, {
      sort: "-fecha",
    });
    return carreras;
  } catch (err) {
    console.error("Error al obtener la lista de carreras:", err);
    throw err;
  }
}


/**
 * Busca una carrera por nombre o texto
 * @param {string} texto - Texto a buscar en el nombre de la carrera
 * @returns {Array} Lista de carreras que coinciden con el texto
 */
export async function getCarreraByText(texto) {
  try {
    const carreras = await pb.collection("carreras").getFullList(200, {
      filter: `nombre~"${texto}"`,
    });
    return carreras;
  } catch (err) {
    console.error("Error al obtener carreras:", err);
    throw err;
  }
}

/**
 * Editar una carrera por id y un objeto con los campos a modificar
 * @param {string} id - ID de la carrera a editar
 * @param {Object} carrera - Objeto con los campos a modificar
 * @returns {Object} Carrera editada
 */
export async function editCarrera(id, carrera) {
  try {
	if (!id) {
	  throw new Error("Debes proporcionar un ID de carrera válido");
	}else if (!carrera || !carrera?.nombre || !carrera?.fecha || !carrera?.distancia || !carrera?.lugar || !carrera?.condiciones) {
	  throw new Error("Debes proporcionar todos los campos de la carrera");
	}else{
		const payload = {
		  nombre: carrera.nombre,
		  fecha: carrera.fecha,
		  distancia: carrera.distancia,
		  condiciones: carrera.condiciones ?? "-",
		  lugar: carrera.lugar,
		};
		const carreraEditada = await pb.collection("carreras").update(id, payload);
		return carreraEditada;
	}
    
  } catch (err) {
    console.error("Error al editar carrera:", err);
    throw err;
  }
}