# Desafío: vacaciones

¡Hola! Este desafío no busca saber cuánto sabés de programación. Lo que nos
interesa es ver cómo encarás algo que (probablemente) nunca hiciste: cómo
investigás, qué decisiones tomás y cómo nos contás lo que hiciste.

No hace falta que termines todo. Hacé lo que puedas y contanos el resto.

## El problema

Queremos una pequeña aplicación web donde se vea, para cada empleado,
**cuántos días de vacaciones le corresponden, cuántos usó y cuántos le
quedan** en el ciclo actual.

El ciclo de vacaciones se renueva una vez por año, en una fecha fija. Cuando
empieza un ciclo nuevo, los días se vuelven a calcular.

En [`data/empleados.json`](data/empleados.json) tenés una lista de empleados
de ejemplo, con su fecha de ingreso y las vacaciones que se tomaron. Podés
usarla, cambiarla o agregarle lo que necesites.

## Lo que pedimos, por niveles

### Nivel 1 — lo mínimo

- Que el proyecto corra **localmente**, es decir, en tu propia computadora.
  Es el primer paso: si lo levantás y ves la página de bienvenida, vas bien.
- Una página que muestre una tabla con los empleados y, para cada uno: días
  que le corresponden, días usados y días que le quedan.
- Si todavía no sabés cómo se calculan los días que le corresponden a cada
  uno, usá 14 para todos.
- Un README (ver más abajo).

### Nivel 2 — lo esperable

- Poder cargar unas vacaciones nuevas para un empleado (desde qué día hasta
  qué día) y que la tabla se actualice.
- Que lo que se carga no se pierda al cerrar y volver a abrir la aplicación.

### Nivel 3 — si te sobra energía

- Que los días que le corresponden a cada empleado dependan de su
  antigüedad, como lo indica la ley argentina. Averiguá cuál es la regla y
  contanos de dónde la sacaste.
- Que el ciclo se renueve solo en la fecha que corresponda.
- Poder ver lo que se tomó cada empleado en ciclos anteriores.
- Publicar la aplicación en internet para que podamos abrirla con un link.
  Esto es un extra: aunque la publiques, tiene que seguir corriendo
  localmente.

Si se te ocurre algo que no está en la lista y te parece útil, adelante.

## Cómo se entrega

1. Hacé un **fork** de este repositorio en tu cuenta de GitHub.
2. **Cloná** tu fork en tu computadora y hacé el trabajo ahí.
3. Andá guardando tu avance con **commits** a lo largo de los días (no todo
   en uno al final: nos interesa ver el camino).
4. Cuando termines, abrí un **Pull Request** desde tu fork hacia este
   repositorio.

Si alguna de estas palabras no te suena, investigar qué significa es parte
del desafío.

## El README

Reemplazá el `README.md` actual por uno tuyo que cuente:

1. **Cómo levantar el proyecto**: los pasos para que otra persona lo pueda
   abrir en su computadora. Vamos a revisar tu entrega siguiendo exactamente
   estos pasos en una computadora que nunca tuvo el proyecto, así que no te
   saltees nada (qué hay que instalar, qué comandos correr, qué abrir en el
   navegador).
2. **Qué hiciste** y hasta qué nivel llegaste.
3. **Qué decisiones tomaste y por qué** (por ejemplo, dónde guardás los datos
   y por qué elegiste esa opción).
4. **Qué no pudiste resolver**, qué probaste y dónde te trabaste. Esto vale
   tanto como lo que sí funciona.
5. **Qué fuentes usaste**: documentación, videos, foros, herramientas de IA.

## Reglas de juego

- **Tiempo:** tenés hasta el _[fecha]_. No le dediques más de _[N]_ horas en
  total.
- **IA:** podés usar ChatGPT, Claude o lo que quieras. Lo único: después
  vamos a tener una charla en la que nos vas a explicar lo que hiciste y vas
  a hacer algún cambio chico en vivo, así que asegurate de entender lo que
  entregás.
- **Pedir ayuda:** si te trabás más de _[N]_ horas con algo, escribinos.
  Saber cuándo pedir ayuda también cuenta.

¡Suerte, y que lo disfrutes!
