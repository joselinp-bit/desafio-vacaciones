import { Suspense } from "react";
import { connection } from "next/server";
import { leerEmpleados } from "../lib/datos";
import { diasCorrespondientes, diasUsados } from "../lib/vacaciones";
import FormularioVacaciones from "./FormularioVacaciones";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Vacaciones</h1>
      <Suspense fallback={<p className="mt-6 text-gray-400">Cargando...</p>}>
        <TablaVacaciones />
      </Suspense>
    </main>
  );
}

// Se calcula en cada visita: así el año del ciclo y los datos están siempre al día.
async function TablaVacaciones() {
  await connection();
  const anio = new Date().getFullYear();
  const empleados = await leerEmpleados();

  return (
    <>
      <p className="mt-1 text-sm text-gray-400">
        Ciclo actual: del 1 de enero al 31 de diciembre de {anio}.
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
              <th className="py-2 text-right">Restantes</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => {
              const corresponden = diasCorrespondientes(empleado, anio);
              const usados = diasUsados(empleado, anio);
              const restantes = corresponden - usados;

              return (
                <tr key={empleado.id} className="border-b border-gray-800">
                  <td className="py-2 pr-4">{empleado.nombre}</td>
                  <td className="py-2 pr-4">{empleado.area}</td>
                  <td className="py-2 pr-4">{empleado.fechaIngreso}</td>
                  <td className="py-2 pr-4 text-right">{corresponden}</td>
                  <td className="py-2 pr-4 text-right">{usados}</td>
                  <td
                    className={`py-2 text-right font-semibold ${
                      restantes < 0 ? "text-red-400" : ""
                    }`}
                  >
                    {restantes}
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