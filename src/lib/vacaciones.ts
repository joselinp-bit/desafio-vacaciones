export type Periodo = { desde: string; hasta: string };

export type Empleado = {
  id: number;
  nombre: string;
  area: string;
  fechaIngreso: string;
  vacacionesTomadas: Periodo[];
};

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Nivel 1: 14 días para todos. En el Nivel 3 esto depende de la antigüedad.
export function diasCorrespondientes(empleado: Empleado): number {
  return 14;
}

// Cuenta los días de un período que caen dentro del año indicado,
// incluyendo el primer y el último día (del 12 al 25 son 14 días).
export function diasEnElAnio(periodo: Periodo, anio: number): number {
  const inicioCiclo = Date.UTC(anio, 0, 1);   // 1 de enero
  const finCiclo = Date.UTC(anio, 11, 31);    // 31 de diciembre

  const desde = Math.max(Date.parse(periodo.desde), inicioCiclo);
  const hasta = Math.min(Date.parse(periodo.hasta), finCiclo);

  if (hasta < desde) return 0; // el período no toca este año
  return Math.round((hasta - desde) / MS_POR_DIA) + 1;
}

export function diasUsados(empleado: Empleado, anio: number): number {
  return empleado.vacacionesTomadas.reduce(
    (total, periodo) => total + diasEnElAnio(periodo, anio),
    0
  );
}