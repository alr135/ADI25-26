// caballosService.js
import { pb } from "./pb.js";

/**
 * Crear un nuevo caballo
 * @param {Object} caballo - Objeto con los datos del caballo
 */
export async function createCaballo(caballo) {
  try {
    const newCaballo = await pb.collection("caballos").create({
      nombre: caballo.nombre,
      descripcion: caballo.descripcion,
      descripcion_larga: caballo.descripcion_larga,
      color: caballo.color,
      sexo: caballo.sexo,
      fecha_nacimiento: caballo.fecha_nacimiento,
      fecha_retiramiento: caballo.fecha_retiramiento,
      fecha_fallecimiento: caballo.fecha_fallecimiento,
      duenyo: caballo.duenyo,
      entrenador: caballo.entrenador,
      hogar: caballo.hogar,
    });
    return newCaballo;
  } catch (err) {
    console.error("Error al crear caballo:", err);
    throw err;
  }
}

/**
 * Crear una nueva entrada en PEDIGRI, que como es solo de caballos se sitúa en este archivo
 * @param {Object} pedigri - Objeto con los datos del pedigrí
 */
export async function createPedigri(pedigri) {
  try {
    const newPedigri = await pb.collection("pedigri").create({
      id_caballo: pedigri.id_caballo,
      id_ascendiente: pedigri.id_ascendiente,
      nombre_ascendiente: pedigri.nombre_ascendiente,
      tipo_relacion: pedigri.tipo_relacion,
    });
    return newPedigri;
  } catch (err) {
    console.error("Error al crear pedigrí:", err);
    throw err;
  }
}

/**
 * Eliminar un caballo por id
 */
export async function deleteCaballo(id) {
  try {
    await pb.collection("caballos").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar caballo:", err);
    throw err;
  }
}

/**
 * Eliminar una relación de pedigrí por id
 */
export async function deletePedigri(id) {
  try {
    await pb.collection("pedigri").delete(id);
    return true;
  } catch (err) {
    console.error("Error al eliminar pedigrí:", err);
    throw err;
  }
}

/**
 * Obtener un caballo con todos sus ascendientes (padre/madre)
 * @param {string} idCaballo - ID del caballo descendiente
 */
export async function getCaballoConAscendientes(idCaballo) {
  try {
    // 1. Obtener el caballo
    const caballo = await pb.collection("caballos").getOne(idCaballo);

    // 2. Buscar sus ascendientes en la colección "pedigri" expandiendo la relación
    const relaciones = await pb.collection("pedigri").getFullList({
      filter: `id_caballo="${idCaballo}"`,
      expand: "id_ascendiente", // así trae el objeto caballo ascendiente completo
    });

    // 3. Devolver caballo + relaciones
    return {
      ...caballo,
      ascendientes: relaciones.map(r => ({
        tipo_relacion: r.tipo_relacion,
        id_ascendiente: r.id_ascendiente,
        nombre_ascendiente: r.nombre_ascendiente,
        ascendiente: r.expand?.id_ascendiente || null,
      })),
    };
  } catch (err) {
    console.error("Error al obtener caballo con ascendientes:", err);
    throw err;
  }
}

/**
 * Obtener la lista de caballos
 * @returns {Array} Lista de caballos ordenados por fecha de creación descendente
 */
export async function getListaCaballos() {
  try {
    const caballos = await pb.collection("caballos").getFullList(200, {
      sort: "-created",
    });
    return caballos;
  } catch (err) {
    console.error("Error al obtener la lista de caballos:", err);
    throw err;
  }
}

/**
 * Obtener un caballo por su nombre o una parte de este
 * @param {string} nombre - Nombre o parte del nombre del caballo
 * @returns {Array} Lista de caballos que coinciden con el nombre proporcionado
 */
export async function getCaballoByText(nombre) {
  try {
    const caballos = await pb.collection("caballos").getFullList(200, {
      filter: `nombre~"${nombre}"`,
    });
    return caballos;
  } catch (err) {
    console.error("Error al obtener caballos:", err);
    throw err;
  }
}


/** 
 * Edita un caballo existente a partir de su id
 * @param {string} id - ID del caballo a editar
 * @param {Object} caballo - Objeto con los datos actualizados del caballo
 * @return {Object} El caballo actualizado
 */
export async function updateCaballo(id, caballo) {
  try {
    const updatedCaballo = await pb.collection("caballos").update(id, {
      nombre: caballo.nombre,
      descripcion: caballo.descripcion,
      descripcion_larga: caballo.descripcion_larga,
      color: caballo.color,
      sexo: caballo.sexo,
      fecha_nacimiento: caballo.fecha_nacimiento,
      fecha_retiramiento: caballo.fecha_retiramiento,
      fecha_fallecimiento: caballo.fecha_fallecimiento,
      duenyo: caballo.duenyo,
      entrenador: caballo.entrenador,
      hogar: caballo.hogar,
    });
    return updatedCaballo;
  } catch (err) {
    console.error("Error al actualizar caballo:", err);
    throw err;
  }
}