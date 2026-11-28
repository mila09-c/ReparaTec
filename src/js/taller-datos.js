import { EQUIPOS, TECNICOS } from './datos_equipo.js';

export const DIAGNOSTICOS = [
  {
    ID_Diagnostico: 1,
    ID_Equipo: 5,
    Fecha_diagnostico: '2026-02-15',
    Problema_detectado: 'Batería degradada y sobrecalentamiento leve bajo carga',
    Estado_base: 'Regular',
    Refaccion_requerida: 'Batería de reemplazo y pasta térmica',
    Observaciones: 'Se recomienda prueba de ciclos tras reemplazo'
  },
  {
    ID_Diagnostico: 2,
    ID_Equipo: 6,
    Fecha_diagnostico: '2026-02-21',
    Problema_detectado: 'Disco mecánico lento con sectores dañados',
    Estado_base: 'Deficiente',
    Refaccion_requerida: 'SSD SATA 480 GB',
    Observaciones: 'Clonar o instalar sistema limpio en unidad nueva'
  },
  {
    ID_Diagnostico: 3,
    ID_Equipo: 8,
    Fecha_diagnostico: '2026-03-06',
    Problema_detectado: 'Falso contacto en puerto de carga USB-C y polvo acumulado',
    Estado_base: 'Regular',
    Refaccion_requerida: 'Conector / Jack de carga y limpieza general',
    Observaciones: 'Verificar voltaje de entrada antes de cerrar chasis'
  },
  {
    ID_Diagnostico: 4,
    ID_Equipo: 10,
    Fecha_diagnostico: '2026-03-17',
    Problema_detectado: 'Teclas superiores sin respuesta y sistema corrupto',
    Estado_base: 'Regular',
    Refaccion_requerida: 'Teclado completo en español',
    Observaciones: 'Realizar reinstalación de sistema operativo tras cambio'
  }
];

export const REPARACIONES = [
  {
    ID_Reparacion: 1,
    ID_Diagnostico: 1,
    ID_Tecnico: 3,
    Fecha_inicio: '2026-02-16',
    Fecha_termino: '2026-02-18',
    Descripcion_trabajo: 'Reemplazo de batería, limpieza de disipador y aplicación de pasta térmica',
    Costo_estimado: 950,
    Costo_final: 900,
    Estado_reparacion: 'Completada'
  },
  {
    ID_Reparacion: 2,
    ID_Diagnostico: 2,
    ID_Tecnico: 1,
    Fecha_inicio: '2026-02-22',
    Fecha_termino: '',
    Descripcion_trabajo: 'Instalación de SSD y migración de entorno de trabajo',
    Costo_estimado: 750,
    Costo_final: 0,
    Estado_reparacion: 'En proceso'
  },
  {
    ID_Reparacion: 3,
    ID_Diagnostico: 3,
    ID_Tecnico: 1,
    Fecha_inicio: '2026-03-07',
    Fecha_termino: '',
    Descripcion_trabajo: 'Revisión de puerto de carga y limpieza interna preventiva',
    Costo_estimado: 500,
    Costo_final: 0,
    Estado_reparacion: 'En proceso'
  },
  {
    ID_Reparacion: 4,
    ID_Diagnostico: 4,
    ID_Tecnico: 2,
    Fecha_inicio: '2026-03-18',
    Fecha_termino: '2026-03-19',
    Descripcion_trabajo: 'Cambio de teclado y reinstalación de sistema operativo',
    Costo_estimado: 680,
    Costo_final: 650,
    Estado_reparacion: 'Completada'
  }
];

export const COMPONENTES = [
  {
    ID_Componente: 1,
    Nombre_componente: 'Batería Interna Li-Ion',
    Marca: 'HP',
    Modelo: 'HS04 / 840 G6',
    Numero_de_serie: 'CMP-BAT-8406',
    Descripcion: 'Batería de reemplazo para laptops corporativas',
    Precio: 720,
    Existencia: 6
  },
  {
    ID_Componente: 2,
    Nombre_componente: 'Unidad SSD 480GB',
    Marca: 'Kingston',
    Modelo: 'A400 2.5"',
    Numero_de_serie: 'CMP-SSD-480A',
    Descripcion: 'Unidad de estado sólido para actualización de equipos',
    Precio: 620,
    Existencia: 9
  },
  {
    ID_Componente: 3,
    Nombre_componente: 'Pasta Térmica Alta Conductividad',
    Marca: 'Arctic',
    Modelo: 'MX-4 (4g)',
    Numero_de_serie: 'CMP-PST-MX04',
    Descripcion: 'Compuesto térmico para disipación de CPU/GPU',
    Precio: 180,
    Existencia: 14
  },
  {
    ID_Componente: 4,
    Nombre_componente: 'Teclado Español Retroiluminado',
    Marca: 'Asus',
    Modelo: 'X515-ES',
    Numero_de_serie: 'CMP-TEC-X515',
    Descripcion: 'Módulo de teclado completo distribución español',
    Precio: 520,
    Existencia: 4
  },
  {
    ID_Componente: 5,
    Nombre_componente: 'Puerto de Carga USB-C',
    Marca: 'Lenovo',
    Modelo: 'T480-DC',
    Numero_de_serie: 'CMP-DCJ-T480',
    Descripcion: 'Conector de alimentación interna de repuesto',
    Precio: 240,
    Existencia: 5
  }
];

export const DETALLES_COMPONENTES = [
  { ID_Detalle: 1, ID_Componente: 1, ID_Reparacion: 1, Cantidad_utilizada: 1, Costo_unitario: 720 },
  { ID_Detalle: 2, ID_Componente: 3, ID_Reparacion: 1, Cantidad_utilizada: 1, Costo_unitario: 180 },
  { ID_Detalle: 3, ID_Componente: 2, ID_Reparacion: 2, Cantidad_utilizada: 1, Costo_unitario: 620 },
  { ID_Detalle: 4, ID_Componente: 4, ID_Reparacion: 4, Cantidad_utilizada: 1, Costo_unitario: 520 }
];

export async function obtenerDiagnosticos() {
  return DIAGNOSTICOS.map((diag) => {
    const equipo = EQUIPOS.find((e) => e.ID_Equipo === diag.ID_Equipo);
    return {
      ...diag,
      Codigo_inventario: equipo ? equipo.Codigo_inventario : 'N/D',
      Equipo_Nombre: equipo ? `${equipo.Marca} ${equipo.Modelo}` : `Equipo #${diag.ID_Equipo}`
    };
  });
}

export async function obtenerReparaciones() {
  return REPARACIONES.map((rep) => {
    const diag = DIAGNOSTICOS.find((d) => d.ID_Diagnostico === rep.ID_Diagnostico);
    const equipo = diag ? EQUIPOS.find((e) => e.ID_Equipo === diag.ID_Equipo) : null;
    const tecnico = TECNICOS.find((t) => t.ID_Tecnico === rep.ID_Tecnico);
    return {
      ...rep,
      ID_Equipo: diag ? diag.ID_Equipo : null,
      Codigo_inventario: equipo ? equipo.Codigo_inventario : 'N/D',
      Equipo_Nombre: equipo ? `${equipo.Marca} ${equipo.Modelo}` : 'Equipo N/D',
      Problema_detectado: diag ? diag.Problema_detectado : 'Sin diagnóstico vinculado',
      Tecnico_Nombre: tecnico ? `Técnico #${tecnico.ID_Tecnico} (${tecnico.Especialidad})` : `Técnico #${rep.ID_Tecnico}`
    };
  });
}

export async function obtenerComponentes() {
  return [...COMPONENTES];
}

export async function obtenerDetallesComponentes() {
  return DETALLES_COMPONENTES.map((det) => {
    const comp = COMPONENTES.find((c) => c.ID_Componente === det.ID_Componente);
    const rep = REPARACIONES.find((r) => r.ID_Reparacion === det.ID_Reparacion);
    const diag = rep ? DIAGNOSTICOS.find((d) => d.ID_Diagnostico === rep.ID_Diagnostico) : null;
    const equipo = diag ? EQUIPOS.find((e) => e.ID_Equipo === diag.ID_Equipo) : null;

    return {
      ...det,
      Nombre_componente: comp ? comp.Nombre_componente : `Componente #${det.ID_Componente}`,
      Reparacion_Label: rep ? `Reparación #${rep.ID_Reparacion}` : `Reparación #${det.ID_Reparacion}`,
      Equipo_Label: equipo ? `${equipo.Codigo_inventario} — ${equipo.Marca} ${equipo.Modelo}` : 'N/D',
      Subtotal: Number(det.Cantidad_utilizada) * Number(det.Costo_unitario)
    };
  });
}