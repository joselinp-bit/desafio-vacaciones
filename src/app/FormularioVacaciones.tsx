"use client";

import { useActionState } from "react";
import { agregarVacaciones } from "./acciones";
import type { Resultado } from "../lib/vacaciones";

type Props = { empleados: { id: number; nombre: string }[] };

const estilosCampo =
  "mt-1 rounded border border-gray-600 bg-gray-900 p-2 [color-scheme:dark]";

export default function FormularioVacaciones({ empleados }: Props) {
  const [resultado, accion, enviando] = useActionState<Resultado, FormData>(
    agregarVacaciones,
    {}
  );

  return (
    <form
      action={accion}
      className="mt-6 flex flex-wrap items-end gap-4 rounded border border-gray-700 p-4"
    >
      <label className="flex flex-col text-sm">
        Empleado
        <select name="empleadoId" required className={estilosCampo}>
          <option value="">Elegí...</option>
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm">
        Desde
        <input type="date" name="desde" required className={estilosCampo} />
      </label>

      <label className="flex flex-col text-sm">
        Hasta
        <input type="date" name="hasta" required className={estilosCampo} />
      </label>

      <button
        type="submit"
        disabled={enviando}
        className="rounded bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
      >
        {enviando ? "Guardando..." : "Cargar vacaciones"}
      </button>

      {resultado.error && (
        <p className="w-full text-sm text-red-400">{resultado.error}</p>
      )}
      {resultado.ok && (
        <p className="w-full text-sm text-green-400">{resultado.ok}</p>
      )}
    </form>
  );
}