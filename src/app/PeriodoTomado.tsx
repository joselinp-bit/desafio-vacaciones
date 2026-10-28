"use client";

import { useActionState, useState } from "react";
import { editarVacaciones } from "./acciones";
import BotonEliminar from "./BotonEliminar";
import { formatearFecha, type Periodo, type Resultado } from "../lib/vacaciones";

type Props = { empleadoId: number; periodo: Periodo };

const estilosCampo =
  "rounded border border-gray-600 bg-gray-900 p-1 text-sm [color-scheme:dark]";

export default function PeriodoTomado({ empleadoId, periodo }: Props) {
  const [editando, setEditando] = useState(false);

  const [resultado, accion, enviando] = useActionState<Resultado, FormData>(
    async (anterior, formData) => {
      const respuesta = await editarVacaciones(anterior, formData);
      // Si se guardó bien, se sale del modo edición.
      if (respuesta.ok) setEditando(false);
      return respuesta;
    },
    {}
  );

  const texto = `${formatearFecha(periodo.desde)} al ${formatearFecha(periodo.hasta)}`;

  if (!editando) {
    return (
      <div className="flex items-center gap-3">
        <span>{texto}</span>
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="text-xs text-blue-400 hover:underline"
        >
          Editar
        </button>
        <BotonEliminar empleadoId={empleadoId} desde={periodo.desde} descripcion={texto} />
      </div>
    );
  }

  return (
    <form action={accion} className="my-1 flex flex-wrap items-center gap-2">
      {/* Datos ocultos para saber qué período se está editando */}
      <input type="hidden" name="empleadoId" value={empleadoId} />
      <input type="hidden" name="desdeOriginal" value={periodo.desde} />

      <input type="date" name="desde" defaultValue={periodo.desde} required className={estilosCampo} />
      <input type="date" name="hasta" defaultValue={periodo.hasta} required className={estilosCampo} />

      <button
        type="submit"
        disabled={enviando}
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-black disabled:opacity-50"
      >
        {enviando ? "Guardando..." : "Guardar"}
      </button>
      <button
        type="button"
        onClick={() => setEditando(false)}
        className="text-xs text-gray-400 hover:underline"
      >
        Cancelar
      </button>

      {resultado.error && (
        <p className="w-full text-xs text-red-400">{resultado.error}</p>
      )}
    </form>
  );
}