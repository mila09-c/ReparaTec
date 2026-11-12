const ROLES = [
  { ID_Rol: 1, Nombre_Rol: 'Administrador', Descripcion: 'Control total de la plataforma', Estado: 'Activo' },
  { ID_Rol: 2, Nombre_Rol: 'Técnico', Descripcion: 'Diagnóstico y reparación de equipos', Estado: 'Activo' },
  { ID_Rol: 3, Nombre_Rol: 'Donador', Descripcion: 'Registro de equipos donados', Estado: 'Activo' },
  { ID_Rol: 4, Nombre_Rol: 'Beneficiario', Descripcion: 'Solicitud de equipos recuperados', Estado: 'Activo' }
];

const USUARIOS = [
  {
    ID_Usuario: 1,
    ID_Rol: 1,
    Nombre_Usuario: 'Ana',
    Apellido: 'Martínez',
    Correo: 'ana.martinez@reparatec.org',
    Contrasena_hash: 'hash_demo_123',
    Telefono: '2291002030',
    Fecha_registro: '2026-01-15',
    Estado: 'Activo'
  },
  {
    ID_Usuario: 2,
    ID_Rol: 2,
    Nombre_Usuario: 'Carlos',
    Apellido: 'López',
    Correo: 'carlos.lopez@reparatec.org',
    Contrasena_hash: 'hash_demo_456',
    Telefono: '2294005060',
    Fecha_registro: '2026-02-10',
    Estado: 'Activo'
  }
];

const EQUIPOS = [
  {
    ID_Equipo: 101,
    ID_Categoria: 1,
    Codigo_inventario: 'RT-LAP-001',
    Marca: 'Dell',
    Modelo: 'Latitude 5420',
    Numero_de_serie: 'SN894321A',
    Procesador: 'Intel Core i5-1135G7',
    Memoria_ram: '16 GB',
    Capacidad_almacenamiento: '512 GB SSD',
    Sistema_operativo: 'Ubuntu 24.04 LTS',
    Estado_equipo: 'Operativo'
  },
  {
    ID_Equipo: 102,
    ID_Categoria: 2,
    Codigo_inventario: 'RT-PC-002',
    Marca: 'HP',
    Modelo: 'ProDesk 400 G7',
    Numero_de_serie: 'SN554120B',
    Procesador: 'Intel Core i3-10100',
    Memoria_ram: '8 GB',
    Capacidad_almacenamiento: '256 GB SSD',
    Sistema_operativo: 'Windows 11 Pro',
    Estado_equipo: 'En reparación'
  },
  {
    ID_Equipo: 103,
    ID_Categoria: 1,
    Codigo_inventario: 'RT-LAP-003',
    Marca: 'Lenovo',
    Modelo: 'ThinkPad T14',
    Numero_de_serie: 'SN778899C',
    Procesador: 'AMD Ryzen 5 PRO',
    Memoria_ram: '16 GB',
    Capacidad_almacenamiento: '512 GB SSD',
    Sistema_operativo: 'Windows 11 Pro',
    Estado_equipo: 'Asignado'
  }
];

const SOLICITUDES = [
  {
    ID_Solicitud: 501,
    ID_Beneficiario: 1,
    Fecha_solicitud: '2026-11-01',
    Motivo: 'Equipamiento de aula de cómputo',
    Uso_destinado: 'Educativo',
    Prioridad: 'Alta',
    Estado: 'Aprobada'
  },
  {
    ID_Solicitud: 502,
    ID_Beneficiario: 2,
    Fecha_solicitud: '2026-11-05',
    Motivo: 'Tesis universitaria',
    Uso_destinado: 'Académico',
    Prioridad: 'Media',
    Estado: 'Pendiente'
  }
];

const DONACIONES = [
  {
    ID_Donacion: 301,
    ID_Donador: 1,
    ID_Equipo: 101,
    Fecha_donacion: '2026-10-12',
    Tipo_entrega: 'Recolección en sede',
    Estado: 'Recibida'
  }
];

const REPARACIONES = [
  {
    ID_Reparacion: 401,
    ID_Diagnostico: 201,
    ID_Tecnico: 1,
    Fecha_inicio: '2026-11-08',
    Descripcion_trabajo: 'Cambio de pasta térmica y módulo RAM',
    Estado_reparacion: 'En proceso'
  }
];

const MODULOS_SISTEMA = [
  {
    id: 'usuarios',
    titulo: 'Usuarios y Roles',
    descripcion: 'Gestión de cuentas, perfiles (USUARIOS) y permisos (ROLES).',
    ruta: '/home.html#usuarios',
    totalRegistros: () => USUARIOS.length
  },
  {
    id: 'equipos',
    titulo: 'Inventario de Equipos',
    descripcion: 'Control de hardware, especificaciones y categorías (EQUIPOS).',
    ruta: '/home.html#equipos',
    totalRegistros: () => EQUIPOS.length
  },
  {
    id: 'donaciones',
    titulo: 'Donaciones',
    descripcion: 'Registro de donadores y recepción de activos (DONACIONES).',
    ruta: '/home.html#donaciones',
    totalRegistros: () => DONACIONES.length
  },
  {
    id: 'diagnosticos',
    titulo: 'Diagnósticos y Reparaciones',
    descripcion: 'Evaluación técnica, reparaciones y componentes (REPARACIONES).',
    ruta: '/home.html#reparaciones',
    totalRegistros: () => REPARACIONES.length
  },
  {
    id: 'solicitudes',
    titulo: 'Solicitudes y Asignaciones',
    descripcion: 'Peticiones de beneficiarios y entregas (SOLICITUDES).',
    ruta: '/home.html#solicitudes',
    totalRegistros: () => SOLICITUDES.length
  },
  {
    id: 'reportes',
    titulo: 'Historial y Evaluaciones',
    descripcion: 'Trazabilidad de movimientos y evaluación post-entrega.',
    ruta: '/home.html#historial',
    totalRegistros: () => EQUIPOS.length
  }
];

// Funciones asíncronas de consulta
export async function obtenerUsuarios() {
  return [...USUARIOS];
}

export async function obtenerUsuario(id) {
  return USUARIOS.find((u) => u.ID_Usuario === Number(id)) || null;
}

export async function obtenerRoles() {
  return [...ROLES];
}

export async function obtenerEquipos() {
  return [...EQUIPOS];
}

export async function obtenerEquipo(id) {
  const equipoEncontrado = EQUIPOS.find((e) => e.ID_Equipo === Number(id));
  return equipoEncontrado || null;
}

export async function obtenerSolicitudes() {
  return [...SOLICITUDES];
}

export async function obtenerModulos() {
  return MODULOS_SISTEMA.map((mod) => ({
    id: mod.id,
    titulo: mod.titulo,
    descripcion: mod.descripcion,
    ruta: mod.ruta,
    total: mod.totalRegistros()
  }));
}