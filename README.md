# ReparaTec

El siguiente proyecto es acerca de una aplicación web para la gestión de soporte técnico, control de inventario de equipos, administración de usuarios y configuración de módulos del sistema, empleando nuestros conocimientos sobre desarrollo web frontend.

## Descripción

La motivación principal fue centralizar y agilizar el seguimiento de reparaciones, equipos tecnológicos y control de acceso de usuarios dentro de un entorno institucional o de laboratorio.
Se buscó desarrollar una interfaz limpia, modular y consistente mediante la carga dinámica de componentes compartidos (header y footer) y vistas CRUD para cada entidad del sistema.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite

## Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Node.js instalado
- Editor de código (recomendamos VS Code)

## Instalación

1. Clona este repositorio:

  - https://github.com/mila09-c/ReparaTec.git

2. Navega a la carpeta del proyecto:

  - ReparaTec

3. Instala las dependencias:

  - `npm install`

4. Inicia el servidor de desarrollo:

  - `npm run dev`

## Uso

1. Ejecuta `npm run dev` en la terminal dentro de la carpeta del proyecto.
2. Abre en tu navegador la URL local que indica Vite (`http://localhost:5173`).
3. Inicia sesión desde `login.html` o navega por los módulos de Usuarios, Módulos y Equipos desde el menú principal.

## Características

- Estructura modular y limpia
- Menú de navegación y pie de página globales cargados dinámicamente (`cargarParciales`)
- Estilos con CSS externo modular (`home.css` + hojas específicas por módulo)
- Vistas completas de listado, detalle y formularios (alta y edición)
- Diseño adaptable (responsive)

## Estructura de CSS y JS

- `src/css/home.css`: Estilos globales, variables, header y footer
- `src/css/modulos.css`: Estilos específicos para tablas, tarjetas de detalle y formularios
- `src/js/main.js`: Lógica global y carga dinámica de parciales
- `src/js/usuarios.js`: Lógica de listado, detalle y formulario de usuarios
- `src/js/modulos.js`: Lógica de listado, detalle y formulario de módulos
- `src/js/equipos-*.js`: Lógica de listado, detalle y formulario de equipos

## Autores

Jessica Cuahutle Romano
jessica.cuahutle.r@gmail.com

Ilde Rayón Cid
ilray930@gmail.com

---