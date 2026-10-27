"use client";

import { useActionState, useState } from "react";
import { agregarVacaciones } from "./acciones";
import {
  type Empleado,
  type Resultado,
  diasCorrespondientes,
  diasEnElAnio,
  diasUsados,
} from "../lib/vacaciones";

type Props = { empleados: Empleado[] };

const estilosCampo =
  "mt-1 rounded border border-gray-600 bg-gray-900 p-2 [color-scheme:dark]";

// Calcula, para cada ciclo que toca el período, cuántos días se descuentan
// y cuántos le quedarían al empleado.
function calcularVistaPrevia(empleado: Empleado, desde: string, hasta: string) {
  const periodo = { desde, hasta };
  const ciclos = [];
  for (let anio = Number(desde.slice(0, 4)); anio <= Number(hasta.slice(0, 4)); anio++) {
    const dias = diasEnElAnio(periodo, anio);
    const quedarian =
      diasCorrespondientes(empleado, anio) - diasUsados(empleado, anio) - dias;
    ciclos.push({ anio, dias, quedarian });
  }
  const total = ciclos.reduce((suma, c) => suma + c.dias, 0);
  return { total, ciclos };
}

export default function FormularioVacaciones({ empleados }: Props) {
  const [empleadoId, setEmpleadoId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [resultado, accion, enviando] = useActionState<Resultado, FormData>(
    async (anterior, formData) => {
      const respuesta = await agregarVacaciones(anterior, formData);
      // Si se guardó bien, se vacían los campos (y con ellos la vista previa).
      if (respuesta.ok) {
        setEmpleadoId("");
        setDesde("");
        setHasta("");
      }
      return respuesta;
    },
    {}
  );

  const empleado = empleados.find((e) => String(e.id) === empleadoId);
  const vistaPrevia =
    empleado && desde && hasta && hasta >= desde
      ? calcularVistaPrevia(empleado, desde, hasta)
      : null;

  return (
    <form
      action={accion}
      className="mt-6 flex flex-wrap items-end gap-4 rounded border border-gray-700 p-4"
    >
      <label className="flex flex-col text-sm">
        Empleado
        <select
          name="empleadoId"
          required
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
          className={estilosCampo}
        >
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
        <input
          type="date"
          name="desde"
          required
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className={estilosCampo}
        />
      </label>

      <label className="flex flex-col text-sm">
        Hasta
        <input
          type="date"
          name="hasta"
          required
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className={estilosCampo}
        />
      </label>

      <button
        type="submit"
        disabled={enviando}
        className="rounded bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
      >
        {enviando ? "Guardando..." : "Cargar vacaciones"}
      </button>

      {vistaPrevia && (
        <div className="w-full text-sm text-gray-300">
          <p>Son {vistaPrevia.total} días corridos.</p>
          {vistaPrevia.ciclos.map((c) => (
            <p key={c.anio} className={c.quedarian < 0 ? "text-amber-400" : ""}>
              Ciclo {c.anio}: se descuentan {c.dias} días y le quedarían {c.quedarian}
              {c.quedarian < 0 && " (supera los días disponibles)"}
            </p>
          ))}
        </div>
      )}

      {resultado.error && (
        <p className="w-full text-sm text-red-400">{resultado.error}</p>
      )}
      {resultado.ok && (
        <p className="w-full text-sm text-green-400">{resultado.ok}</p>
      )}
    </form>
  );
}