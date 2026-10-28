# Desafío vacaciones

En esta aplicación web se puede ver, para cada empleado, cuántos días de vacaciones le corresponden, cuántos usó y cuántos le quedan en cada ciclo, y también cargar y eliminar vacaciones. Trabajé sobre la base que venía en el repositorio: Next.js 16, React 19, TypeScript y Tailwind CSS.

## 1. Cómo levantar el proyecto

Para correrlo hace falta tener instalados [Node.js](https://nodejs.org) (yo usé la versión 24 LTS, que ya trae npm) y [Git](https://git-scm.com). Para comprobar que están instalados, alcanza con abrir una terminal y correr:

```
node -v
npm -v
git --version
```

Después hay que clonar el repositorio y entrar a la carpeta del proyecto, que es desde donde se corren todos los comandos siguientes:

```
git clone https://github.com/joselinp-bit/desafio-vacaciones.git
cd desafio-vacaciones
```

Por último, instalar las dependencias y levantar el servidor:

```
npm install
npm run dev
```

Cuando la terminal muestra `Ready`, la aplicación queda disponible en http://localhost:3000. El servidor funciona mientras esa terminal esté abierta: para frenarlo se aprieta `Ctrl + C`, y si se cierra la terminal hay que volver a correr `npm run dev`.

Al hacer `npm install` me aparecieron dos avisos que no impiden que el proyecto funcione: uno sobre `eslint@9.39.5` deprecado, que es la versión que trae el repo base, y otro de `install-scripts` sobre el paquete `unrs-resolver`, que es un control de seguridad de npm 11 sobre un paquete que usa ESLint y no la aplicación.

Las vacaciones que se cargan se guardan en `data/empleados.json`. Para volver a los datos de ejemplo originales, se puede correr `git restore data/empleados.json`.

## 2. Qué hice y hasta qué nivel llegué

Completé el Nivel 1 y el Nivel 2, y del Nivel 3 resolví todo menos la publicación en internet.

La página principal muestra una tabla con cada empleado, su área, su fecha de ingreso, sus días correspondientes, usados y restantes, y los períodos que se tomó. Arriba hay un formulario para cargar vacaciones nuevas: se elige el empleado y las fechas, y la tabla se actualiza al guardar. Lo cargado queda guardado aunque se cierre y se vuelva a abrir la aplicación.

Del Nivel 3, los días que corresponden dependen de la antigüedad según la Ley de Contrato de Trabajo. El ciclo se renueva solo cada 1 de enero, y con unos botones se puede ver cualquier ciclo anterior con lo que se tomó cada empleado.

Además agregué cuatro cosas que no estaban en la consigna y que me parecieron útiles. Se pueden ver los ciclos futuros cuando hay vacaciones planificadas que caen en el año siguiente. Cada período tiene botones para editar sus fechas o eliminarlo, por si se cargó mal. Y el formulario muestra, mientras se eligen las fechas, cuántos días son y cuántos le quedarían al empleado en cada ciclo, con un aviso si supera los disponibles.

Para verificar los cálculos hice cuentas a mano y las comparé con la tabla. Por ejemplo, a Joaquín, que ingresó el 01/10/2021, le corresponden 14 días en 2025 y 21 en 2026, porque al 31/12/2026 su antigüedad ya supera los 5 años. Las vacaciones de Martín del 22/12/2025 al 04/01/2026 aparecen en los dos ciclos, con 10 días descontados en 2025 y 4 en 2026. Para probar el caso de ingreso tardío, cambié temporalmente el ingreso de Valentina al 01/09/2026, y le correspondieron 4 días: 88 días hábiles trabajados divididos por 20. También probé que el formulario rechace fechas invertidas y períodos superpuestos, y que los datos sigan ahí después de reiniciar el servidor.

## 3. Decisiones y por qué

Tomé como ciclo el año calendario, del 1 de enero al 31 de diciembre, porque la ley calcula la antigüedad para las vacaciones al 31 de diciembre de cada año. Cuento los días corridos, incluyendo el primero y el último de cada período. Cuando unas vacaciones cruzan de un año a otro, cada día se descuenta del ciclo al que pertenece.

Para los días que corresponden apliqué el artículo 150 de la ley: 14 días si la antigüedad no supera 5 años, 21 si supera 5, 28 si supera 10 y 35 si supera 20. Para saber si la antigüedad "supera" una cantidad de años, comparo la fecha del aniversario con el 31 de diciembre, en lugar de restar años. Si restara años, Joaquín, que en 2026 tiene 5 años y 3 meses, daría 5 y recibiría 14 días, cuando le corresponden 21.

También apliqué los artículos 151 y 153: si alguien no trabajó al menos la mitad de los días hábiles del año, le corresponde un día por cada 20 trabajados. Para contar los días hábiles tomé de lunes a viernes. La ley indica que los feriados en que la persona normalmente trabajaría cuentan como hábiles, así que no los descuento.

Para guardar los datos seguí usando el mismo archivo `data/empleados.json`, leyéndolo y escribiéndolo desde el servidor. Es la opción más simple: no requiere instalar una base de datos, y cualquiera puede abrir el archivo y ver qué se guardó. El formulario envía los datos a una Server Action (`src/app/acciones.ts`), que antes de guardar valida que estén todos los campos, que la fecha de fin no sea anterior a la de inicio y que el período no se superponga con otro ya cargado.

Separé los cálculos en `src/lib/vacaciones.ts`, de modo que la tabla y la vista previa del formulario usan exactamente las mismas funciones y los números siempre coinciden. La página se calcula en cada visita (con `await connection()`), para mostrar siempre la fecha y los datos actuales. El ciclo que se muestra va en la dirección de la página (por ejemplo `/?anio=2025`), así cada ciclo tiene su propio link. En cada ciclo solo aparecen los empleados que ya habían ingresado ese año. En los ciclos futuros, los días que corresponden son una proyección que supone que la persona sigue trabajando todo el año.

En la vista previa, superar los días disponibles muestra un aviso pero no impide guardar, porque en la práctica a veces se adelantan días del ciclo siguiente. Para eliminar un período lo identifico por el empleado y su fecha de inicio, que es única porque no se permiten superposiciones. Si el período cruza de año, se elimina completo.

Las validaciones (campos completos, fechas no invertidas y sin superposiciones) están en una sola función que usan tanto la carga como la edición. Al editar, el período que se modifica no cuenta como superposición consigo mismo.

## 4. Qué no pude resolver y dónde me trabé

No publiqué la aplicación en internet. El servicio más directo para Next.js es Vercel, pero ahí los archivos del proyecto no se pueden modificar, así que el formulario no podría guardar en el JSON. Las alternativas eran publicarla sin poder guardar, sumar una base de datos o usar un servicio con disco persistente. Preferí no agregar esa complejidad y dejar la aplicación funcionando completa en forma local.

Durante el desarrollo me trabé en varios puntos. Al principio confundí *fork* con *clone*: había hecho la copia del repositorio en mi cuenta de GitHub, pero no lo había descargado, y corrí `npm install` fuera de la carpeta del proyecto. El error `ENOENT ... package.json` me hizo dar cuenta de que npm no encontraba el proyecto. También vi que en `cmd` los acentos del JSON aparecían como caracteres raros, y entendí que era un tema de codificación de la terminal y no del archivo, que se soluciona con `chcp 65001`. Más adelante apareció el aviso "Another next dev server is already running": tenía dos servidores abiertos a la vez, uno en el `cmd` y otro en la terminal de VS Code, y lo resolví cerrando uno.

Cuando quise mostrar el año actual con `new Date()`, Next.js me tiró el error "encountered the unstable value new Date() while prerendering". El proyecto tiene activado *Cache Components*, así que Next intenta generar la página por adelantado, pero la fecha cambia en cada visita. De las tres soluciones que propone (cachear el valor, calcularlo en el navegador o calcularlo en cada visita), elegí la última, con `await connection()` dentro de un `<Suspense>`, porque cachearlo habría congelado la tabla y los datos viven en el servidor.

## 5. Fuentes

- Documentación de instalación de [Node.js](https://nodejs.org) y [Git](https://git-scm.com).
- El archivo `AGENTS.md` del repo, que avisa que Next.js 16 tiene cambios respecto de versiones anteriores y recomienda consultar la documentación local en `node_modules/next/dist/docs/`.
- El panel de errores de Next.js, que me explicó el problema con `new Date()` y me propuso las soluciones.
- Ley de Contrato de Trabajo N.º 20.744, artículos 150, 151 y 153 ([texto actualizado en InfoLEG](https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25552/texact.htm)).
- Notas de iProfesional y Tributum sobre la Ley 27.802 de Modernización Laboral (2026), para confirmar que la reforma no cambió los días por antigüedad.
- Claude (IA), que usé como asistente para instalar el entorno, entender los errores y escribir el código, que después revisé y verifiqué con cuentas a mano.