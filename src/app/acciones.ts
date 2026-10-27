"use server";

import { revalidatePath } from "next/cache";
import { leerEmpleados, guardarEmpleados } from "../lib/datos";
import type { Resultado } from "../lib/vacaciones";

export async function agregarVacaciones(
  _anterior: Resultado,
  formData: FormData
): Promise<Resultado> {
  const empleadoId = Number(formData.get("empleadoId"));
  const desde = String(formData.get("desde") ?? "");
  const hasta = String(formData.get("hasta") ?? "");

  if (!empleadoId || !desde || !hasta) {
    return { error: "Completá todos los campos." };
  }
  // Las fechas "AAAA-MM-DD" se pueden comparar como texto.
  if (hasta < desde) {
    return { error: "La fecha de fin no puede ser anterior a la de inicio." };
  }

  const empleados = await leerEmpleados();
  const empleado = empleados.find((e) => e.id === empleadoId);
  if (!empleado) {
    return { error: "No se encontró el empleado." };
  }

  // Dos períodos se superponen si cada uno empieza antes de que termine el otro.
  const seSuperpone = empleado.vacacionesTomadas.some(
    (p) => desde <= p.hasta && hasta >= p.desde
  );
  if (seSuperpone) {
    return { error: "Esas fechas se superponen con vacaciones ya cargadas." };
  }

  empleado.vacacionesTomadas.push({ desde, hasta });
  empleado.vacacionesTomadas.sort((a, b) => a.desde.localeCompare(b.desde));
  await guardarEmpleados(empleados);

  revalidatePath("/"); // le avisa a Next que la página cambió
  return { ok: `Vacaciones cargadas para ${empleado.nombre}.` };
}
export async function eliminarVacaciones(
  empleadoId: number,
  desde: string
): Promise<void> {
  const empleados = await leerEmpleados();
  const empleado = empleados.find((e) => e.id === empleadoId);
  if (!empleado) return;

  // Un empleado no puede tener dos períodos que empiecen el mismo día
  // (el formulario impide superposiciones), así que "desde" identifica al período.
  empleado.vacacionesTomadas = empleado.vacacionesTomadas.filter(
    (p) => p.desde !== desde
  );
  await guardarEmpleados(empleados);
  revalidatePath("/");
}