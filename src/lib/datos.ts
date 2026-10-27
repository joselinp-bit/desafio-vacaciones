import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Empleado } from "./vacaciones";

// Ruta al JSON, armada desde la carpeta raíz del proyecto.
const RUTA = path.join(process.cwd(), "data", "empleados.json");

export async function leerEmpleados(): Promise<Empleado[]> {
  const texto = await readFile(RUTA, "utf-8");
  return JSON.parse(texto) as Empleado[];
}

export async function guardarEmpleados(empleados: Empleado[]): Promise<void> {
  await writeFile(RUTA, JSON.stringify(empleados, null, 2) + "\n", "utf-8");
}