export type Periodo = { desde: string; hasta: string };

export type Empleado = {
  id: number;
  nombre: string;
  area: string;
  fechaIngreso: string;
  vacacionesTomadas: Periodo[];
};

// Respuesta del formulario: un mensaje de error o de éxito.
export type Resultado = { error?: string; ok?: string };

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Indica si, al 31 de diciembre del año del ciclo, la antigüedad supera
// la cantidad de años indicada (compara la fecha del aniversario).
function superaAnios(fechaIngreso: string, anios: number, anio: number): boolean {
  const ingreso = new Date(Date.parse(fechaIngreso));
  const aniversario = Date.UTC(
    ingreso.getUTCFullYear() + anios,
    ingreso.getUTCMonth(),
    ingreso.getUTCDate()
  );
  return aniversario < Date.UTC(anio, 11, 31);
}

// Cuenta los días de lunes a viernes entre dos fechas (ambas incluidas).
function diasHabiles(desde: number, hasta: number): number {
  let total = 0;
  for (let t = desde; t <= hasta; t += MS_POR_DIA) {
    const diaSemana = new Date(t).getUTCDay(); // 0 = domingo, 6 = sábado
    if (diaSemana !== 0 && diaSemana !== 6) total++;
  }
  return total;
}

// Días que corresponden en el ciclo según la Ley de Contrato de Trabajo.
export function diasCorrespondientes(empleado: Empleado, anio: number): number {
  const inicioAnio = Date.UTC(anio, 0, 1);
  const finAnio = Date.UTC(anio, 11, 31);
  const ingreso = Date.parse(empleado.fechaIngreso);

  if (ingreso > finAnio) return 0; // todavía no había ingresado

  // Art. 151: si trabajó menos de la mitad de los días hábiles del año,
  // le corresponde 1 día por cada 20 trabajados.
  const habilesTrabajados = diasHabiles(Math.max(ingreso, inicioAnio), finAnio);
  const habilesDelAnio = diasHabiles(inicioAnio, finAnio);
  if (habilesTrabajados < habilesDelAnio / 2) {
    return Math.floor(habilesTrabajados / 20);
  }

  // Art. 150: según antigüedad al 31 de diciembre.
  if (superaAnios(empleado.fechaIngreso, 20, anio)) return 35;
  if (superaAnios(empleado.fechaIngreso, 10, anio)) return 28;
  if (superaAnios(empleado.fechaIngreso, 5, anio)) return 21;
  return 14;
}

// Cuenta los días de un período que caen dentro del año indicado,
// incluyendo el primer y el último día (del 12 al 25 son 14 días).
export function diasEnElAnio(periodo: Periodo, anio: number): number {
  const inicioCiclo = Date.UTC(anio, 0, 1); // 1 de enero
  const finCiclo = Date.UTC(anio, 11, 31); // 31 de diciembre

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