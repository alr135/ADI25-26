// pb.js
import PocketBase from "pocketbase";

// Crear una única instancia (singleton)
export const pb = new PocketBase("http://127.0.0.1:8090");

// Solo usar localStorage si existe
if (typeof window !== "undefined") {
  pb.authStore.loadFromLocalStorage();

  pb.authStore.onChange(() => {
    pb.authStore.saveToLocalStorage();
  });
}

export const SUPERUSER = {
  email: "alr135@alu.ua.es",
  password: "-qcTpc1xwdftA6X"
};