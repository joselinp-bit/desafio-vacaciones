# Desafío vacaciones

En esta aplicación web se puede ver, para cada empleado, cuántos días de vacaciones le corresponden, cuántos usó y cuántos le quedan en el ciclo actual. Trabajé sobre la base que venía en el repositorio.

## 1. Cómo levantar el proyecto

Instale [Node.js](https://nodejs.org) (versión 24 LTS, que ya trae npm) y [Git](https://git-scm.com).


Después hay que clone el repositorio y entre a la carpeta del proyecto, que es desde donde se corren todos los comandos siguientes:

```
git clone https://github.com/joselinp-bit/desafio-vacaciones.git
cd desafio-vacaciones
```
Por último, instale las dependencias y levante el servidor:


Cuando la terminal mostro `Ready`, la aplicación queda disponible en http://localhost:3000. Para frenarla, se aprieta `Ctrl + C` en esa misma terminal. 

Al hacer `npm install` me aparecieron dos avisos que no impiden que el proyecto funcione: uno sobre `eslint@9.39.5` deprecado, que es la versión que trae el repo base, y otro de `install-scripts` sobre el paquete `unrs-resolver`, que es un control de seguridad de npm 11 sobre un paquete que usa ESLint y no la aplicación.

## 2. Qué hice y hasta qué nivel llegué

Completé el Nivel 1. Instalé el entorno, levanté el proyecto en mi computadora y armé la página principal con una tabla que muestra, para cada empleado, su área, su fecha de ingreso y sus días correspondientes, usados y restantes. Por ahora asigné 14 días a todos, como pide la consigna para este nivel.

Para verificar que los cálculos estuvieran bien, hice algunas cuentas a mano y las comparé con la tabla. A Lucía, que se tomó del 12 al 25 de enero, le dan 14 días usados y 0 restantes. A Martín le dan 11: 4 de enero y 7 de julio. También noté que, con 14 días fijos, Diego y Joaquín quedan con saldo negativo.

## 3. Decisiones y por qué

Tomé como ciclo el año calendario, del 1 de enero al 31 de diciembre, porque la Ley de Contrato de Trabajo calcula la antigüedad para las vacaciones al 31 de diciembre de cada año. Cuento los días corridos, incluyendo el primero y el último de cada período. Cuando unas vacaciones cruzan de un año a otro, como las de Martín (del 22/12/2025 al 04/01/2026), solo cuento los días que caen dentro del ciclo actual, para que cada día se descuente del año al que pertenece.

Separé los cálculos en `src/lib/vacaciones.ts` y dejé que la página (`src/app/page.tsx`) solo se ocupe de mostrar los datos. Así puedo cambiar la forma de calcular los días sin tocar la tabla. Además, si a alguien le quedan días negativos, el número aparece en rojo.

## 4. Qué no pude resolver y dónde me trabé

Al principio confundí *fork* con *clone*: hice la copia del repositorio en mi cuenta de GitHub, pero no lo había descargado a mi computadora, y corrí `npm install` fuera de la carpeta del proyecto. El error `ENOENT ... package.json` me hizo dar cuenta de que npm no encontraba el proyecto. También vi que en `cmd` los acentos del JSON aparecían como caracteres raros. Investigando entendí que era un tema de codificación de la terminal y no del archivo, y que se soluciona corriendo `chcp 65001`.

Cuando quise mostrar el año actual con `new Date()`, Next.js me tiró el error "encountered the unstable value new Date() while prerendering". El proyecto tiene activado *Cache Components*, así que Next intenta generar la página por adelantado, pero la fecha cambia en cada visita. Next me propuso tres soluciones: cachear el valor, calcularlo en el navegador o calcularlo en cada visita. Elegí la última, usando `await connection()` dentro de un `<Suspense>`, porque cachearlo habría dejado la tabla congelada y calcularlo en el navegador no tenía sentido si los datos están en el servidor.

## 5. Fuentes

- Documentación de instalación de [Node.js](https://nodejs.org) y [Git](https://git-scm.com).
- El archivo `AGENTS.md` del repo, que avisa que Next.js 16 tiene cambios respecto de versiones anteriores y recomienda consultar la documentación local en `node_modules/next/dist/docs/`.
- El panel de errores de Next.js, que me explicó el problema con `new Date()` y me propuso las soluciones.
- Ley de Contrato de Trabajo N.º 20.744, art. 150, para definir el ciclo según la antigüedad al 31 de diciembre.
- Claude (IA), que usé como asistente para instalar el entorno, entender los errores y escribir el código, que después revisé y verifiqué con cuentas a mano.