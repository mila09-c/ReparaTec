/**
 * Datos y funciones asíncronas para el módulo de Inventario de Equipos (EQUIPOS)
 * ReparaTec
 */

export const EQUIPOS = [
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

/**
 * @returns {Promise<Array>}
 */
export async function obtenerEquipos() {
  return [...EQUIPOS];
}

/**
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function obtenerEquipo(id) {
  const equipoEncontrado = EQUIPOS.find((e) => e.ID_Equipo === Number(id));
  return equipoEncontrado || null;
}