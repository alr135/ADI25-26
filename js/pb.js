// pb.js
import PocketBase from "pocketbase";

// Crear una única instancia (singleton)
export const pb = new PocketBase("http://127.0.0.1:8090");

// Si ya hay sesión guardada en localStorage, la carga
pb.authStore.loadFromLocalStorage();

// Opcional: cada vez que cambia la sesión, guardarla en localStorage
pb.authStore.onChange(() => {
  pb.authStore.saveToLocalStorage();
});
