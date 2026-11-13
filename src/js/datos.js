// --- ROLES (para login.js) ---
export const roles = [
  { ID_Rol: 1, Nombre_Rol: 'Administrador' },
  { ID_Rol: 2, Nombre_Rol: 'Técnico' },
  { ID_Rol: 3, Nombre_Rol: 'Voluntario' }
];

export async function obtenerRoles() {
  return [...roles];
}

// --- USUARIOS (compatible con usuarios.js y home.js) ---
export const usuarios = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    Nombre_Usuario: 'Carlos',
    Apellido: 'Mendoza',
    correo: 'carlos.mendoza@reparatec.mx',
    rol: 'Técnico',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Ana Torres',
    Nombre_Usuario: 'Ana',
    Apellido: 'Torres',
    correo: 'ana.torres@reparatec.mx',
    rol: 'Administrador',
    estado: 'Activo'
  }
];

export async function obtenerUsuarios() {
  return [...usuarios];
}

export async function obtenerUsuario(id) {
  return usuarios.find((u) => u.id === Number(id)) || null;
}

// --- MÓDULOS DEL SISTEMA (compatible con modulos.js y home.js) ---
export const modulos = [
  {
    id: 1,
    nombre: 'Gestión de Usuarios',
    titulo: 'Gestión de Usuarios',
    total: 2,
    descripcion: 'Control de accesos, roles y cuentas del sistema.',
    ruta: '/usuarios-lista.html',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Módulos del Sistema',
    titulo: 'Módulos del Sistema',
    total: 4,
    descripcion: 'Administración y configuración de los módulos de REPARATEC.',
    ruta: '/modulos-lista.html',
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: 'Inventario de Equipos',
    titulo: 'Inventario de Equipos',
    total: 3,
    descripcion: 'Registro y seguimiento de equipos de cómputo.',
    ruta: '/home.html',
    estado: 'Activo'
  },
  {
    id: 4,
    nombre: 'Diagnósticos Técnicos',
    titulo: 'Diagnósticos Técnicos',
    total: 0,
    descripcion: 'Evaluación de fallas y estado de hardware.',
    ruta: '/home.html',
    estado: 'Inactivo'
  }
];

export async function obtenerModulos() {
  return [...modulos];
}

export async function obtenerModuloPorId(id) {
  return modulos.find((m) => m.id === Number(id)) || null;
}

// --- EQUIPOS (para home.js) ---
export const equipos = [
  {
    Codigo_inventario: 'EQ-001',
    Marca: 'Dell',
    Modelo: 'Latitude 5490',
    Procesador: 'Intel Core i5',
    Memoria_ram: '8 GB',
    Sistema_operativo: 'Windows 11',
    Estado_equipo: 'Operativo'
  },
  {
    Codigo_inventario: 'EQ-002',
    Marca: 'HP',
    Modelo: 'ProBook 450 G6',
    Procesador: 'Intel Core i7',
    Memoria_ram: '16 GB',
    Sistema_operativo: 'Ubuntu 22.04',
    Estado_equipo: 'En diagnóstico'
  },
  {
    Codigo_inventario: 'EQ-003',
    Marca: 'Lenovo',
    Modelo: 'ThinkPad T480',
    Procesador: 'Intel Core i5',
    Memoria_ram: '8 GB',
    Sistema_operativo: 'Windows 10',
    Estado_equipo: 'Listo para donación'
  }
];

export async function obtenerEquipos() {
  return [...equipos];
}