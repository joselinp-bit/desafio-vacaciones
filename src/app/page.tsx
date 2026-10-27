import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { leerEmpleados } from "../lib/datos";
import {
  aniosDisponibles,
  diasCorrespondientes,
  diasUsados,
  formatearFecha,
  periodosDelAnio,
} from "../lib/vacaciones";
import FormularioVacaciones from "./FormularioVacaciones";

type Props = { searchParams: Promise<{ anio?: string }> };

export default function Home({ searchParams }: Props) {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">Vacaciones</h1>
      <Suspense fallback={<p className="mt-6 text-gray-400">Cargando...</p>}>
        <TablaVacaciones searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// Se calcula en cada visita: así el año del ciclo y los datos están siempre al día.
async function TablaVacaciones({ searchParams }: Props) {
  await connection();
  const anioActual = new Date().getFullYear();
  const empleados = await leerEmpleados();
  const anios = aniosDisponibles(empleados, anioActual);

  // El año viene en la URL (?anio=2025). Si no viene o no es válido, se usa el actual.
  const { anio: anioEnUrl } = await searchParams;
  const anio = anios.includes(Number(anioEnUrl)) ? Number(anioEnUrl) : anioActual;

  // Solo se muestran los empleados que ya habían ingresado ese año.
  const empleadosDelCiclo = empleados.filter(
    (e) => e.fechaIngreso <= `${anio}-12-31`
  );

  return (
    <>
      <nav className="mt-4 flex flex-wrap gap-2">
        {anios.map((a) => (
          <Link
            key={a}
            href={a === anioActual ? "/" : `/?anio=${a}`}
            className={`rounded border px-3 py-1 text-sm ${
              a === anio
                ? "border-white bg-white font-semibold text-black"
                : "border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            {a}
            {a === anioActual && " (actual)"}
            {a > anioActual && " (planificado)"}
          </Link>
        ))}
      </nav>

      <p className="mt-3 text-sm text-gray-400">
        Ciclo {anio}: del 1 de enero al 31 de diciembre de {anio}.
      </p>

      <FormularioVacaciones
        empleados={empleados.map((e) => ({ id: e.id, nombre: e.nombre }))}
      />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-700 text-gray-400">
            <tr>
              <th className="py-2 pr-4">Empleado</th>
              <th className="py-2 pr-4">Área</th>
              <th className="py-2 pr-4">Ingreso</th>
              <th className="py-2 pr-4 text-right">Corresponden</th>
              <th className="py-2 pr-4 text-right">Usados</th>
              <th className="py-2 pr-4 text-right">Restantes</th>
              <th className="py-2">Períodos tomados</th>
            </tr>
          </thead>
          <tbody>
            {empleadosDelCiclo.map((empleado) => {
              const corresponden = diasCorrespondientes(empleado, anio);
              const usados = diasUsados(empleado, anio);
              const restantes = corresponden - usados;
              const periodos = periodosDelAnio(empleado, anio);

              return (
                <tr key={empleado.id} className="border-b border-gray-800 align-top">
                  <td className="py-2 pr-4">{empleado.nombre}</td>
                  <td className="py-2 pr-4">{empleado.area}</td>
                  <td className="py-2 pr-4">{formatearFecha(empleado.fechaIngreso)}</td>
                  <td className="py-2 pr-4 text-right">{corresponden}</td>
                  <td className="py-2 pr-4 text-right">{usados}</td>
                  <td
                    className={`py-2 pr-4 text-right font-semibold ${
                      restantes < 0 ? "text-red-400" : ""
                    }`}
                  >
                    {restantes}
                  </td>
                  <td className="py-2 text-gray-300">
                    {periodos.length === 0
                      ? "—"
                      : periodos.map((p) => (
                          <div key={p.desde}>
                            {formatearFecha(p.desde)} al {formatearFecha(p.hasta)}
                          </div>
                        ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}