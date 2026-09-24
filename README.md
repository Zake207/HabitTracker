# Habit Tracker
## Fase 0
### Elecciones técnicas
#### TypeScript

TypeScript se utilizará como lenguaje principal con el objetivo de desarrollar el proyecto mientras se profundiza en:

Tipado estático.
Interfaces y tipos.
Inferencia de tipos.
Uniones y tipos opcionales.
Funciones tipadas.
Control de errores.
Diseño y modelado del dominio.
#### Vite

Se seleccionó Vite como herramienta de desarrollo por proporcionar:

Servidor local.
Recarga automática.
Integración con TypeScript.
Sistema de build para producción.
Configuración inicial reducida.
#### Vanilla TypeScript

Se seleccionó Vanilla + TypeScript en lugar de un framework como React o Vue.

La decisión permite centrarse inicialmente en TypeScript y en las APIs estándar del navegador sin introducir simultáneamente las abstracciones propias de un framework.

La incorporación posterior de un framework podrá evaluarse en función de las necesidades del proyecto.

### Gestión de Node.js

Durante la configuración se detectó que la versión disponible inicialmente era:

Node.js v18.19.1

Esta versión no era compatible con la versión utilizada por create-vite.

El entorno utiliza Fish como shell, por lo que se descartó el uso directo del nvm tradicional, basado en scripts para Bash/Zsh.

Se adoptó fnm (Fast Node Manager) como gestor de versiones de Node.js.

La arquitectura resultante es:

fnm
 └── Node.js
      └── npm
           └── proyecto TypeScript

Esta configuración permite cambiar de versión de Node.js según las necesidades de cada proyecto.

### Decisiones pendientes

En esta fase se han evitado deliberadamente decisiones relacionadas con:

Framework de interfaz definitivo.
Backend.
Base de datos.
Autenticación.
Sistema de sincronización.
Persistencia definitiva.
Arquitectura de despliegue.

Estas decisiones se tomarán cuando los requisitos del proyecto las justifiquen.