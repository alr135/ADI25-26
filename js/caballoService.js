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
