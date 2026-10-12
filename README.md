# Habit Tracker

## Instalación y puesta en marcha

Esta sección explica cómo instalar, iniciar y utilizar HabitTracker en un entorno Linux.

### 1. Requisitos previos

Antes de comenzar, asegúrate de disponer de las siguientes herramientas:

- **Git**, para descargar el repositorio.
- **Node.js y npm**, para instalar las dependencias y ejecutar la aplicación.
- Un navegador web moderno.

Puedes comprobar si tienes las herramientas necesarias ejecutando:

```bash
git --version
node --version
npm --version
```

Si alguno de estos comandos no está disponible, instala la herramienta correspondiente antes de continuar.

### 2. Descargar el repositorio

Clona el repositorio en tu equipo:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Sustituye `<URL_DEL_REPOSITORIO>` por la dirección del repositorio de HabitTracker en GitHub.

El directorio del proyecto debe quedar ubicado en:

```text
~/HabitTracker
```

Esta ruta es importante porque el comando de arranque incluido en el proyecto utiliza esa ubicación.

### 3. Instalar las dependencias

Accede al directorio del proyecto e instala las dependencias:

```bash
cd ~/HabitTracker
npm install
```

npm descargará los paquetes necesarios para ejecutar la aplicación.

Este paso solo es necesario durante la instalación inicial, salvo que posteriormente se incorporen nuevas dependencias.

### 4. Configurar el comando `habits`

HabitTracker incluye un script de arranque que permite iniciar la aplicación desde cualquier directorio de la terminal.

Primero, asegúrate de que el script tiene permisos de ejecución:

```bash
chmod +x ~/HabitTracker/scripts/habits
```

A continuación, crea el directorio destinado a los comandos personales e instala el enlace al script:

```bash
mkdir -p ~/.local/bin

ln -sfn \
  ~/HabitTracker/scripts/habits \
  ~/.local/bin/habits
```

Si utilizas Fish, añade el directorio al `PATH`:

```fish
fish_add_path ~/.local/bin
```

Puedes comprobar que el comando está disponible con:

```fish
type -a habits
```

Si la terminal no reconoce el comando, comprueba que `~/.local/bin` está incluido en el `PATH`.

### 5. Iniciar HabitTracker

Una vez completada la instalación, ya no es necesario acceder al directorio del proyecto para iniciar la aplicación.

Desde cualquier ubicación, ejecuta:

```bash
habits
```

El comando iniciará el servidor de desarrollo de Vite y abrirá automáticamente el navegador en la siguiente dirección:

**http://localhost:5173**

HabitTracker requiere que ese puerto esté disponible. Si otra aplicación lo está utilizando, Vite mostrará un error en lugar de seleccionar un puerto diferente.

Mantén abierta la terminal mientras utilizas HabitTracker. Para detener la aplicación, pulsa `Ctrl + C`.

### 6. Uso habitual

A partir de la instalación inicial, el flujo de trabajo es sencillo:

1. Abre una terminal.
2. Ejecuta `habits`.
3. Espera a que se inicie el servidor y se abra el navegador.
4. Utiliza HabitTracker desde la interfaz web.
5. Cuando termines, vuelve a la terminal y pulsa `Ctrl + C`.

No necesitas repetir `git clone`, `npm install` ni la configuración del comando en cada sesión.

### 7. Actualizar el proyecto

Si quieres descargar los últimos cambios del repositorio, detén la aplicación y ejecuta:

```bash
cd ~/HabitTracker
git pull
npm install
```

Después, vuelve a iniciar HabitTracker con:

```bash
habits
```

Ejecutar `npm install` tras actualizar permite instalar las dependencias que puedan haberse añadido al proyecto.

### 8. Persistencia de los datos

La aplicación utiliza actualmente almacenamiento local del navegador para conservar los datos.

Para evitar acceder accidentalmente a un almacenamiento distinto, inicia HabitTracker mediante el comando `habits` y utiliza siempre la dirección:

```text
http://localhost:5173
```

El almacenamiento del navegador está asociado al origen de la aplicación. Cambiar de puerto puede hacer que los datos guardados no estén disponibles en la nueva dirección.

Ten en cuenta que el almacenamiento local no equivale a una copia de seguridad: borrar los datos del navegador o utilizar otro perfil puede hacer que pierdas el acceso a la información guardada.

### Solución de problemas

- **El comando `habits` no existe:** comprueba que `~/.local/bin` está incluido en el `PATH` y que el enlace simbólico apunta al script correcto.
- **No se encuentran las dependencias:** accede al directorio del proyecto y ejecuta `npm install`.
- **El puerto 5173 está ocupado:** cierra la aplicación que lo está utilizando antes de iniciar HabitTracker.
- **El navegador no se abre automáticamente:** comprueba la salida de la terminal y abre manualmente `http://localhost:5173`.
- **No aparecen los datos guardados:** comprueba que estás utilizando la misma dirección, el mismo perfil de navegador y que no se han borrado los datos del sitio.
