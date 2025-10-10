import { registerUser, login, logout, getCurrentUser, getAllUsers, getUserById, updateUser, deleteUser } from "../userService.js";
import { pb, SUPERUSER } from "../pb.js";

beforeAll(async () => {
  try {
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    console.log("Superuser autenticado para tests");
  } catch (err) {
    console.error("Error autenticando superuser:", err);
  }
});

describe("User Service", () => {
  let testUserId = null;
  const testUserEmail = "testuser@example.com";
  const testUserPassword = "password123";

  // Limpiar cualquier usuario de prueba existente antes de comenzar
  beforeAll(async () => {
    try {
      const existingUsers = await pb.collection('users').getFullList({
        filter: `email="${testUserEmail}"`
      });
      for (const user of existingUsers) {
        await pb.collection('users').delete(user.id);
      }
    } catch (err) {
      // Ignorar errores si no existe
    }
  });

  test("Registrar un nuevo usuario", async () => {
    const newUser = await registerUser({
      nombre: "Usuario de Prueba",
      email: testUserEmail,
      password: testUserPassword
    });

    expect(newUser).toHaveProperty("id");
    expect(newUser.nombre).toBe("Usuario de Prueba");
    expect(newUser.email).toBe(testUserEmail);
    expect(newUser.rol).toBe("usuario");

    testUserId = newUser.id;
  });

  test("Iniciar sesión con el usuario registrado", async () => {
    const authData = await login(testUserEmail, testUserPassword);

    expect(authData).toHaveProperty("token");
    expect(authData.record.id).toBe(testUserId);
    expect(authData.record.email).toBe(testUserEmail);
  });

  test("Obtener el usuario actual después del login", async () => {
    const currentUser = getCurrentUser();
    
    expect(currentUser).not.toBeNull();
    expect(currentUser.id).toBe(testUserId);
    expect(currentUser.email).toBe(testUserEmail);
  });

  test("Obtener todos los usuarios", async () => {
    const users = await getAllUsers();
    
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users.some(user => user.id === testUserId)).toBe(true);
  });

  test("Obtener un usuario por ID", async () => {
    const user = await getUserById(testUserId);
    
    expect(user.id).toBe(testUserId);
    expect(user.nombre).toBe("Usuario de Prueba");
    expect(user.email).toBe(testUserEmail);
  });


  test("Cerrar sesión", () => {
    logout();
    const currentUser = getCurrentUser();
    expect(currentUser).toBeNull();
  });

  test("Error al iniciar sesión con credenciales incorrectas", async () => {
    await expect(login("nonexistent@example.com", "wrongpassword"))
      .rejects.toThrow();
  });

  test("Eliminar el usuario de prueba", async () => {
    // Asegurarse de estar autenticado como admin para eliminar
    await pb.admins.authWithPassword(SUPERUSER.email, SUPERUSER.password);
    
    const result = await deleteUser(testUserId);
    expect(result).toBe(true);
  });
});