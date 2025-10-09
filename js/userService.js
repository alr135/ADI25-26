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
 * Registrar nuevo usuario (CREATE)
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
      avatar_url: "" // valor por defecto
    });
    return newUser;
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    throw err;
  }
}

/**
 * Obtener el usuario logueado (READ)
 */
export function getCurrentUser() {
  return pb.authStore.model; // null si no hay nadie logueado
}

/**
 * Listar todos los usuarios (READ)
 */
export async function getAllUsers() {
  try {
    const users = await pb.collection("users").getFullList();
    return users;
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    throw err;
  }
}

/**
 * Buscar un usuario por id (READ)
 */
export async function getUserById(id) {
  try {
    const user = await pb.collection("users").getOne(id);
    return user;
  } catch (err) {
    console.error(`Error al obtener usuario con id ${id}:`, err);
    throw err;
  }
}

/**
 * Editar un usuario (UPDATE)
 * Puedes actualizar nombre, avatar_url, rol, password, etc.
 */
export async function updateUser(id, updates) {
  try {
    // Si se actualiza la contraseña, hay que incluir también passwordConfirm
    if (updates.password) {
      updates.passwordConfirm = updates.password;
    }

    const updatedUser = await pb.collection("users").update(id, updates);
    return updatedUser;
  } catch (err) {
    console.error(`Error al actualizar usuario con id ${id}:`, err);
    throw err;
  }
}

/**
 * Eliminar un usuario (DELETE)
 */
export async function deleteUser(id) {
  try {
    await pb.collection("users").delete(id);
    return true;
  } catch (err) {
    console.error(`Error al eliminar usuario con id ${id}:`, err);
    throw err;
  }
}
