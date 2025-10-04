// userService.js
import { pb } from "./pb.js";

/**
 * Iniciar sesión
 */
export async function login(email, password) {
  try {
    const authData = await pb.collection("users").authWithPassword(email, password);
    return authData; // contiene el usuario + token
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    throw err;
  }
}

/**
 * Cerrar sesión
 */
export function logout() {
  pb.authStore.clear();
}

/**
 * Registrar nuevo usuario
 */
export async function registerUser({ nombre, email, password }) {
  try {
    const newUser = await pb.collection("users").create({
      nombre,
      email,
      password,
      passwordConfirm: password, // PocketBase exige confirmación
      rol: "usuario", // valor por defecto
      fecha_registro: new Date().toISOString(),
    });
    return newUser;
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    throw err;
  }
}

/**
 * Obtener el usuario logueado
 */
export function getCurrentUser() {
  return pb.authStore.model; // null si no hay nadie logueado
}
