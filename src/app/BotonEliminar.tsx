"use client";

import { eliminarVacaciones } from "./acciones";

type Props = { empleadoId: number; desde: string; descripcion: string };

export default function BotonEliminar({ empleadoId, desde, descripcion }: Props) {
  return (
    <form
      action={eliminarVacaciones.bind(null, empleadoId, desde)}
      onSubmit={(evento) => {
        // Si el usuario cancela la confirmación, el formulario no se envía.
        if (!confirm(`¿Eliminar las vacaciones del ${descripcion}?`)) {
          evento.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs text-red-400 hover:underline">
        Eliminar
      </button>
    </form>
  );
}