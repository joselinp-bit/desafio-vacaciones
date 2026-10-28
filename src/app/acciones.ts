"use server";

import { revalidatePath } from "next/cache";
import { leerEmpleados, guardarEmpleados } from "../lib/datos";
import type { Empleado, Resultado } from "../lib/vacaciones";

// Validaciones comunes para cargar y editar. Devuelve el mensaje de error,
// o null si el período es válido. "ignorarDesde" sirve al editar: el período
// que se está modificando no cuenta como superposición consigo mismo.
function validarPeriodo(
  empleado: Empleado,
  desde: string,
  hasta: string,
  ignorarDesde?: string
): string | null {
  if (!desde || !hasta) {
    return "Completá todos los campos.";
  }
  // Las fechas "AAAA-MM-DD" se pueden comparar como texto.
  if (hasta < desde) {
    return "La fecha de fin no puede ser anterior a la de inicio.";
  }
  // Dos períodos se superponen si cada uno empieza antes de que termine el otro.
  const seSuperpone = empleado.vacacionesTomadas.some(
    (p) => p.desde !== ignorarDesde && desde <= p.hasta && hasta >= p.desde
  );
  if (seSuperpone) {
    return "Esas fechas se superponen con vacaciones ya cargadas.";
  }
  return null;
}

export async function agregarVacaciones(
  _anterior: Resultado,
  formData: FormData
): Promise<Resultado> {
  const empleadoId = Number(formData.get("empleadoId"));
  const desde = String(formData.get("desde") ?? "");
  const hasta = String(formData.get("hasta") ?? "");

  const empleados = await leerEmpleados();
  const empleado = empleados.find((e) => e.id === empleadoId);
  if (!empleado) {
    return { error: "Elegí un empleado." };
  }

  const error = validarPeriodo(empleado, desde, hasta);
  if (error) return { error };

  empleado.vacacionesTomadas.push({ desde, hasta });
  empleado.vacacionesTomadas.sort((a, b) => a.desde.localeCompare(b.desde));
  await guardarEmpleados(empleados);

  revalidatePath("/");
  return { ok: `Vacaciones cargadas para ${empleado.nombre}.` };
}

export async function editarVacaciones(
  _anterior: Resultado,
  formData: FormData
): Promise<Resultado> {
  const empleadoId = Number(formData.get("empleadoId"));
  const desdeOriginal = String(formData.get("desdeOriginal") ?? "");
  const desde = String(formData.get("desde") ?? "");
  const hasta = String(formData.get("hasta") ?? "");

  const empleados = await leerEmpleados();
  const empleado = empleados.find((e) => e.id === empleadoId);
  if (!empleado) {
    return { error: "No se encontró el empleado." };
  }

  const periodo = empleado.vacacionesTomadas.find((p) => p.desde === desdeOriginal);
  if (!periodo) {
    return { error: "No se encontró el período a editar." };
  }

  const error = validarPeriodo(empleado, desde, hasta, desdeOriginal);
  if (error) return { error };

  periodo.desde = desde;
  periodo.hasta = hasta;
  empleado.vacacionesTomadas.sort((a, b) => a.desde.localeCompare(b.desde));
  await guardarEmpleados(empleados);

  revalidatePath("/");
  return { ok: "Vacaciones actualizadas." };
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