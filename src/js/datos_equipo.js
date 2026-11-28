export const CATEGORIAS = [
  { ID_Categoria: 1, Nombre_Categoria: 'Laptop', Descripcion: 'Computadoras portatiles de uso general o academico', Estado: 'Activo' },
  { ID_Categoria: 2, Nombre_Categoria: 'Escritorio', Descripcion: 'Computadoras de escritorio ( torre o all-in-one )', Estado: 'Activo' },
  { ID_Categoria: 3, Nombre_Categoria: 'Monitor', Descripcion: 'Pantallas LCD, LED o IPS de distintos tamanos', Estado: 'Activo' },
  { ID_Categoria: 4, Nombre_Categoria: 'Impresora', Descripcion: 'Equipos de impresion laser o inyeccion de tinta', Estado: 'Activo' },
  { ID_Categoria: 5, Nombre_Categoria: 'Proyector', Descripcion: 'Proyectores multimedia para aulas y auditorios', Estado: 'Activo' },
  { ID_Categoria: 6, Nombre_Categoria: 'Tablet', Descripcion: 'Tabletas electronicas para aprendizaje interactivo', Estado: 'Activo' },
  { ID_Categoria: 7, Nombre_Categoria: 'Red y Conectividad', Descripcion: 'Switches, routers y puntos de acceso', Estado: 'Activo' },
  { ID_Categoria: 8, Nombre_Categoria: 'UPS / Respaldo', Descripcion: 'No-breaks y reguladores de voltaje', Estado: 'Activo' },
  { ID_Categoria: 9, Nombre_Categoria: 'Perifericos', Descripcion: 'Teclados, ratones, bocinas y webcams', Estado: 'Activo' },
  { ID_Categoria: 10, Nombre_Categoria: 'Almacenamiento Externo', Descripcion: 'Discos duros y unidades externas de respaldo', Estado: 'Inactivo' }
];

export const DONADORES = [
  { ID_Donador: 1, Tipo_donador: 'Empresa', Direccion: 'Blvd. Hermanos Serdan 450, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 2, Tipo_donador: 'Persona Fisica', Direccion: 'Calle 16 de Septiembre 112, Cholula, Pue.', Estado: 'Activo' },
  { ID_Donador: 3, Tipo_donador: 'Empresa', Direccion: 'Av. Juarez 2840, Col. La Paz, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 4, Tipo_donador: 'Institucion Educativa', Direccion: 'Circuito Universitario 100, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 5, Tipo_donador: 'Persona Fisica', Direccion: 'Privada Las Flores 28, Tlaxcalancingo, Pue.', Estado: 'Activo' },
  { ID_Donador: 6, Tipo_donador: 'Empresa', Direccion: 'Parque Industrial Puebla 2000, Lote 14, Pue.', Estado: 'Activo' },
  { ID_Donador: 7, Tipo_donador: 'Asociacion', Direccion: 'Calle Reforma 75, Centro, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 8, Tipo_donador: 'Persona Fisica', Direccion: 'Av. 31 Poniente 1905, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 9, Tipo_donador: 'Empresa', Direccion: 'Calzada Zavaleta 3100, Puebla, Pue.', Estado: 'Activo' },
  { ID_Donador: 10, Tipo_donador: 'Persona Fisica', Direccion: 'Calle 5 de Mayo 409, Atlixco, Pue.', Estado: 'Activo' }
];

export const DONACIONES = [
  { ID_Donacion: 1, Fecha_donacion: '2026-01-20', Tipo_entrega: 'Recoleccion', Observaciones: 'Lote corporativo por renovacion de flota', Estado: 'Completada', ID_Donador: 1 },
  { ID_Donacion: 2, Fecha_donacion: '2026-01-25', Tipo_entrega: 'Presencial', Observaciones: 'Laptop personal con cargador original', Estado: 'Completada', ID_Donador: 2 },
  { ID_Donacion: 3, Fecha_donacion: '2026-02-03', Tipo_entrega: 'Recoleccion', Observaciones: 'Equipos de oficina en buen estado general', Estado: 'Completada', ID_Donador: 3 },
  { ID_Donacion: 4, Fecha_donacion: '2026-02-08', Tipo_entrega: 'Presencial', Observaciones: 'Monitores y equipos de laboratorio academico', Estado: 'Completada', ID_Donador: 4 },
  { ID_Donacion: 5, Fecha_donacion: '2026-02-14', Tipo_entrega: 'Presencial', Observaciones: 'Equipo portatil con bateria desgastada', Estado: 'Completada', ID_Donador: 5 },
  { ID_Donacion: 6, Fecha_donacion: '2026-02-19', Tipo_entrega: 'Recoleccion', Observaciones: 'Lote mixto de laptops y equipos de red', Estado: 'En revision', ID_Donador: 6 },
  { ID_Donacion: 7, Fecha_donacion: '2026-02-26', Tipo_entrega: 'Presencial', Observaciones: 'Donacion de asociacion aliada', Estado: 'Completada', ID_Donador: 7 },
  { ID_Donacion: 8, Fecha_donacion: '2026-03-04', Tipo_entrega: 'Presencial', Observaciones: 'Computadora de escritorio sin monitor', Estado: 'Completada', ID_Donador: 8 },
  { ID_Donacion: 9, Fecha_donacion: '2026-03-11', Tipo_entrega: 'Recoleccion', Observaciones: 'Equipos corporativos pendientes de inventario', Estado: 'Pendiente', ID_Donador: 9 },
  { ID_Donacion: 10, Fecha_donacion: '2026-03-16', Tipo_entrega: 'Presencial', Observaciones: 'Laptop con falla en teclado detectada al recibir', Estado: 'Completada', ID_Donador: 10 }
];

export const EQUIPOS = [
  { ID_Equipo: 1, Codigo_inventario: 'RPT-EQ-0001', Marca: 'Dell', Modelo: 'Latitude 5420', Numero_de_serie: 'SN-DL5420-001', Procesador: 'Intel Core i5-1135G7', Memoria_ram: '16 GB DDR4', Capacidad_almacenamiento: '512 GB NVMe', Sistema_operativo: 'Ubuntu 24.04 LTS', Perfil_rendimiento: 'Alto', Fecha_registro: '2026-01-21', Estado_equipo: 'Listo para asignar', ID_Categoria: 1, ID_Donacion: 1 },
  { ID_Equipo: 2, Codigo_inventario: 'RPT-EQ-0002', Marca: 'HP', Modelo: 'ProBook 440 G8', Numero_de_serie: 'SN-HP4408-002', Procesador: 'Intel Core i5-1135G7', Memoria_ram: '8 GB DDR4', Capacidad_almacenamiento: '256 GB SSD', Sistema_operativo: 'Windows 11 Pro', Perfil_rendimiento: 'Medio', Fecha_registro: '2026-01-26', Estado_equipo: 'Asignado', ID_Categoria: 1, ID_Donacion: 2 },
  { ID_Equipo: 3, Codigo_inventario: 'RPT-EQ-0003', Marca: 'Lenovo', Modelo: 'ThinkCentre M720q', Numero_de_serie: 'SN-LVM720-003', Procesador: 'Intel Core i3-8100T', Memoria_ram: '8 GB DDR4', Capacidad_almacenamiento: '256 GB SSD', Sistema_operativo: 'Linux Mint 22', Perfil_rendimiento: 'Medio', Fecha_registro: '2026-02-04', Estado_equipo: 'Asignado', ID_Categoria: 2, ID_Donacion: 3 },
  { ID_Equipo: 4, Codigo_inventario: 'RPT-EQ-0004', Marca: 'Dell', Modelo: 'P2422H', Numero_de_serie: 'SN-DLP242-004', Procesador: 'N/A', Memoria_ram: 'N/A', Capacidad_almacenamiento: 'N/A', Sistema_operativo: 'N/A', Perfil_rendimiento: 'Basico', Fecha_registro: '2026-02-09', Estado_equipo: 'Listo para asignar', ID_Categoria: 3, ID_Donacion: 4 },
  { ID_Equipo: 5, Codigo_inventario: 'RPT-EQ-0005', Marca: 'HP', Modelo: 'EliteBook 840 G6', Numero_de_serie: 'SN-HP8406-005', Procesador: 'Intel Core i7-8665U', Memoria_ram: '16 GB DDR4', Capacidad_almacenamiento: '512 GB SSD', Sistema_operativo: 'Ubuntu 24.04 LTS', Perfil_rendimiento: 'Alto', Fecha_registro: '2026-02-15', Estado_equipo: 'En reparacion', ID_Categoria: 1, ID_Donacion: 5 },
  { ID_Equipo: 6, Codigo_inventario: 'RPT-EQ-0006', Marca: 'Acer', Modelo: 'Veriton X4660G', Numero_de_serie: 'SN-AC4660-006', Procesador: 'Intel Core i5-8400', Memoria_ram: '8 GB DDR4', Capacidad_almacenamiento: '1 TB HDD', Sistema_operativo: 'Windows 10 Pro', Perfil_rendimiento: 'Medio', Fecha_registro: '2026-02-20', Estado_equipo: 'Diagnosticado', ID_Categoria: 2, ID_Donacion: 6 },
  { ID_Equipo: 7, Codigo_inventario: 'RPT-EQ-0007', Marca: 'Epson', Modelo: 'PowerLite E20', Numero_de_serie: 'SN-EPE20-007', Procesador: 'N/A', Memoria_ram: 'N/A', Capacidad_almacenamiento: 'N/A', Sistema_operativo: 'Firmware Epson', Perfil_rendimiento: 'Basico', Fecha_registro: '2026-02-27', Estado_equipo: 'Asignado', ID_Categoria: 5, ID_Donacion: 7 },
  { ID_Equipo: 8, Codigo_inventario: 'RPT-EQ-0008', Marca: 'Lenovo', Modelo: 'ThinkPad T480', Numero_de_serie: 'SN-LVT480-008', Procesador: 'Intel Core i5-8250U', Memoria_ram: '16 GB DDR4', Capacidad_almacenamiento: '256 GB SSD', Sistema_operativo: 'Ubuntu 24.04 LTS', Perfil_rendimiento: 'Medio', Fecha_registro: '2026-03-05', Estado_equipo: 'En reparacion', ID_Categoria: 1, ID_Donacion: 8 },
  { ID_Equipo: 9, Codigo_inventario: 'RPT-EQ-0009', Marca: 'Cisco', Modelo: 'Catalyst 2960-X', Numero_de_serie: 'SN-CS2960-009', Procesador: 'ARM Dual-Core', Memoria_ram: '512 MB', Capacidad_almacenamiento: '128 MB Flash', Sistema_operativo: 'IOS 15.2', Perfil_rendimiento: 'Medio', Fecha_registro: '2026-03-12', Estado_equipo: 'En revision', ID_Categoria: 7, ID_Donacion: 9 },
  { ID_Equipo: 10, Codigo_inventario: 'RPT-EQ-0010', Marca: 'Asus', Modelo: 'VivoBook X515', Numero_de_serie: 'SN-ASX515-010', Procesador: 'AMD Ryzen 5 5500U', Memoria_ram: '8 GB DDR4', Capacidad_almacenamiento: '512 GB SSD', Sistema_operativo: 'Windows 11 Home', Perfil_rendimiento: 'Alto', Fecha_registro: '2026-03-17', Estado_equipo: 'En reparacion', ID_Categoria: 1, ID_Donacion: 10 }
];

export const TECNICOS = [
  { ID_Tecnico: 1, Especialidad: 'Hardware y Microsoldadura', Disponibilidad: 'Disponible' },
  { ID_Tecnico: 2, Especialidad: 'Sistemas Operativos y Redes', Disponibilidad: 'Disponible' },
  { ID_Tecnico: 3, Especialidad: 'Laptops y Diagnóstico General', Disponibilidad: 'Ocupado' }
];

export const BENEFICIARIOS = [
  { ID_Beneficiario: 1, Tipo_beneficiario: 'Institucion Educativa', Institucion: 'Primaria Benito Juarez', Necesidad_tecnologica: 'Equipos para aula de medios y apoyo escolar' },
  { ID_Beneficiario: 2, Tipo_beneficiario: 'Asociacion Civil', Institucion: 'Casa de Cultura San Andres', Necesidad_tecnologica: 'Laptops para talleres comunitarios' },
  { ID_Beneficiario: 3, Tipo_beneficiario: 'Estudiante', Institucion: 'Secundaria Tecnica 14', Necesidad_tecnologica: 'Equipo de escritorio para tareas y programación básica' }
];

export const HISTORIAL_EQUIPOS = [
  { ID_Historial: 1, Fecha_movimiento: '2026-01-21 10:30:00', Tipo_movimiento: 'Ingreso', Descripcion: 'Recepcion e inventario inicial de equipo donado', Ubicacion_anterior: 'Externo - Donador', Ubicacion_nueva: 'Almacen ReparaTec - Entrada', ID_Asignacion: 1, ID_Equipo: 1 },
  { ID_Historial: 2, Fecha_movimiento: '2026-02-16 12:00:00', Tipo_movimiento: 'Entrega', Descripcion: 'Entrega formal a Primaria Benito Juarez', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Primaria Benito Juarez - Aula Medios', ID_Asignacion: 1, ID_Equipo: 1 },
  { ID_Historial: 3, Fecha_movimiento: '2026-02-19 11:15:00', Tipo_movimiento: 'Entrega', Descripcion: 'Entrega de laptop a Casa de Cultura San Andres', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Casa de Cultura San Andres', ID_Asignacion: 2, ID_Equipo: 2 },
  { ID_Historial: 4, Fecha_movimiento: '2026-02-21 14:20:00', Tipo_movimiento: 'Entrega', Descripcion: 'Entrega de equipo de escritorio a estudiante', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Domicilio Beneficiario - Secundaria 14', ID_Asignacion: 3, ID_Equipo: 3 },
  { ID_Historial: 5, Fecha_movimiento: '2026-02-26 09:45:00', Tipo_movimiento: 'Entrega', Descripcion: 'Entrega de monitor a Fundacion Manos que Ayudan', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Fundacion Manos que Ayudan', ID_Asignacion: 4, ID_Equipo: 4 },
  { ID_Historial: 6, Fecha_movimiento: '2026-02-15 16:00:00', Tipo_movimiento: 'Traslado a taller', Descripcion: 'Ingreso a banco de pruebas por bateria degradada', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Taller Tecnico - Estacion 1', ID_Asignacion: 5, ID_Equipo: 5 },
  { ID_Historial: 7, Fecha_movimiento: '2026-02-21 10:00:00', Tipo_movimiento: 'Diagnostico', Descripcion: 'Cambio de disco mecanico a SSD y diagnostico general', Ubicacion_anterior: 'Taller Tecnico - Estacion 2', Ubicacion_nueva: 'Almacen ReparaTec - Espera', ID_Asignacion: 5, ID_Equipo: 6 },
  { ID_Historial: 8, Fecha_movimiento: '2026-03-10 13:10:00', Tipo_movimiento: 'Entrega', Descripcion: 'Entrega de proyector a Biblioteca Publica Morelos', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Biblioteca Publica Morelos', ID_Asignacion: 7, ID_Equipo: 7 },
  { ID_Historial: 9, Fecha_movimiento: '2026-03-06 15:30:00', Tipo_movimiento: 'Ingreso a taller', Descripcion: 'Revision de puerto de carga y limpieza interna', Ubicacion_anterior: 'Almacen ReparaTec', Ubicacion_nueva: 'Taller Tecnico - Estacion 3', ID_Asignacion: 6, ID_Equipo: 8 },
  { ID_Historial: 10, Fecha_movimiento: '2026-03-18 11:00:00', Tipo_movimiento: 'Preparacion', Descripcion: 'Cambio de teclado y reinstalacion de sistema operativo', Ubicacion_anterior: 'Taller Tecnico - Estacion 1', Ubicacion_nueva: 'Area de Entregas ReparaTec', ID_Asignacion: 10, ID_Equipo: 10 }
];

export async function obtenerCategorias() {
  return [...CATEGORIAS];
}

export async function obtenerDonaciones() {
  return [...DONACIONES];
}

export async function obtenerDonadores() {
  return [...DONADORES];
}

export async function obtenerTecnicos() {
  return [...TECNICOS];
}

export async function obtenerBeneficiarios() {
  return [...BENEFICIARIOS];
}

export async function obtenerEquipos() {
  return EQUIPOS.map((eq) => {
    const cat = CATEGORIAS.find((c) => c.ID_Categoria === eq.ID_Categoria);
    return {
      ...eq,
      Nombre_Categoria: cat ? cat.Nombre_Categoria : 'Sin categoría'
    };
  });
}

export async function obtenerEquipo(id) {
  const eq = EQUIPOS.find((e) => e.ID_Equipo === Number(id));
  if (!eq) return null;
  const cat = CATEGORIAS.find((c) => c.ID_Categoria === eq.ID_Categoria);
  const don = DONACIONES.find((d) => d.ID_Donacion === eq.ID_Donacion);
  return {
    ...eq,
    Nombre_Categoria: cat ? cat.Nombre_Categoria : 'Sin categoría',
    Donacion_Info: don ? `#${don.ID_Donacion} (${don.Fecha_donacion} - ${don.Tipo_entrega})` : 'N/D'
  };
}

export async function obtenerHistorialPorEquipo(idEquipo) {
  return HISTORIAL_EQUIPOS.filter((h) => h.ID_Equipo === Number(idEquipo));
}