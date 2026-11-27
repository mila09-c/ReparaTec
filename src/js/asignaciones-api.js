import { api } from './api.js';
import { BENEFICIARIOS, EQUIPOS, HISTORIAL_EQUIPOS } from './datos_equipo.js';

export const USAR_FALLBACK_LOCAL = true;

const SOLICITUDES_MOCK = [
  {
    ID_Solicitud: 1,
    ID_Beneficiario: 1,
    Fecha_solicitud: '2026-02-01',
    Motivo: 'Equipamiento de aula de medios para alumnos de primaria',
    Uso_destinado: 'Apoyo académico y ofimática básica',
    Prioridad: 'Alta',
    Estado: 'Aprobada',
    Observaciones: 'Prioridad por matrícula escolar',
  },
  {
    ID_Solicitud: 2,
    ID_Beneficiario: 2,
    Fecha_solicitud: '2026-02-10',
    Motivo: 'Laptops para talleres comunitarios de alfabetización digital',
    Uso_destinado: 'Cursos comunitarios',
    Prioridad: 'Media',
    Estado: 'Aprobada',
    Observaciones: 'Requiere equipo portátil funcional',
  },
  {
    ID_Solicitud: 3,
    ID_Beneficiario: 3,
    Fecha_solicitud: '2026-02-15',
    Motivo: 'Equipo de escritorio para tareas y programación básica',
    Uso_destinado: 'Estudio en casa',
    Prioridad: 'Media',
    Estado: 'En revisión',
    Observaciones: 'Pendiente validación socioeconómica',
  },
];

const ASIGNACIONES_MOCK = [
  {
    ID_Asignacion: 1,
    ID_Solicitud: 1,
    ID_Equipo: 1,
    Fecha_programada: '2026-02-15',
    Fecha_entrega: '2026-02-16',
    Condiciones_entrega: 'Equipo entregado funcionando con cargador y cable de red',
    Estado: 'Entregada',
    Recomendaciones: 'Mantener en aula con regulador de voltaje',
  },
  {
    ID_Asignacion: 2,
    ID_Solicitud: 2,
    ID_Equipo: 2,
    Fecha_programada: '2026-02-19',
    Fecha_entrega: '2026-02-19',
    Condiciones_entrega: 'Laptop entregada con batería cargada y sistema listo',
    Estado: 'Entregada',
    Recomendaciones: 'Respaldar archivos de talleres periódicamente',
  },
];

const EVALUACIONES_MOCK = [
  {
    ID_Evaluacion: 1,
    ID_Beneficiario: 1,
    Fecha_evaluacion: '2026-03-01',
    Calificacion: 5,
    Estado_funcionamiento: 'Óptimo',
    Observaciones: 'Los equipos han sido de gran utilidad en el aula de medios',
  },
  {
    ID_Evaluacion: 2,
    ID_Beneficiario: 2,
    Fecha_evaluacion: '2026-03-08',
    Calificacion: 4,
    Estado_funcionamiento: 'Bueno',
    Observaciones: 'Buen desempeño general en sesiones semanales',
  },
];

const localStore = {
  beneficiarios: [...BENEFICIARIOS],
  solicitudes: [...SOLICITUDES_MOCK],
  asignaciones: [...ASIGNACIONES_MOCK],
  evaluaciones: [...EVALUACIONES_MOCK],
  equipos: EQUIPOS.map((eq) => ({ ...eq })),
  historial: [...HISTORIAL_EQUIPOS],
};

function extraerLista(respuesta, clavesPosibles = []) {
  if (Array.isArray(respuesta)) return respuesta;
  if (!respuesta || typeof respuesta !== 'object') return [];
  for (const clave of clavesPosibles) {
    if (Array.isArray(respuesta[clave])) return respuesta[clave];
  }
  if (Array.isArray(respuesta.data)) return respuesta.data;
  if (Array.isArray(respuesta.rows)) return respuesta.rows;
  return [];
}

function esErrorDeEndpointNoDisponible(error) {
  const msg = String(error?.message || '').toLowerCase();
  return (
    msg.includes('no se pudo conectar') ||
    msg.includes('failed to fetch') ||
    msg.includes('404') ||
    msg.includes('not found') ||
    msg.includes('cannot get') ||
    msg.includes('cannot post') ||
    msg.includes('cannot put')
  );
}

async function consultarConFallback(llamadaApi, accionLocal) {
  if (!USAR_FALLBACK_LOCAL) {
    return await llamadaApi();
  }
  try {
    return await llamadaApi();
  } catch (error) {
    if (esErrorDeEndpointNoDisponible(error)) {
      return await accionLocal();
    }
    throw error;
  }
}

function aplicarEntregaLocal(datos, idAsignacion, equipoSeleccionado = null, beneficiarioNombre = '') {
  const esEntrega = datos.Estado === 'Entregada' || Boolean(datos.Fecha_entrega);
  if (!datos.ID_Equipo || !esEntrega) return;

  const eq = localStore.equipos.find(
    (item) => Number(item.ID_Equipo ?? item.id) === Number(datos.ID_Equipo)
  );
  const estadoPrevio = eq?.Estado_equipo || equipoSeleccionado?.Estado_equipo || 'Listo para asignar';

  if (eq) {
    eq.Estado_equipo = 'Asignado';
  }

  const fechaMov = `${datos.Fecha_entrega || new Date().toISOString().split('T')[0]} 12:00:00`;
  const ubicacionAnterior =
    estadoPrevio === 'Asignado' ? 'Almacén ReparaTec' : `Almacén (${estadoPrevio})`;
  const ubicacionNueva = beneficiarioNombre
    ? `${beneficiarioNombre} — Asignado`
    : 'Asignado a Beneficiario';

  localStore.historial.unshift({
    ID_Historial: localStore.historial.length + 1,
    Fecha_movimiento: fechaMov,
    Tipo_movimiento: 'Entrega',
    Descripcion: `Entrega vinculada a asignación${idAsignacion ? ` #${idAsignacion}` : ''} (${datos.Condiciones_entrega})`,
    Ubicacion_anterior: ubicacionAnterior,
    Ubicacion_nueva: ubicacionNueva,
    ID_Asignacion: idAsignacion ? Number(idAsignacion) : null,
    ID_Equipo: Number(datos.ID_Equipo),
  });
}

export async function obtenerBeneficiariosApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/beneficiarios'), ['beneficiarios']),
    () => [...localStore.beneficiarios]
  );
}

export async function crearBeneficiarioApi(datos) {
  return await consultarConFallback(
    () => api.post('/api/beneficiarios', datos),
    () => {
      const nuevo = {
        ID_Beneficiario: localStore.beneficiarios.length + 1,
        ...datos,
      };
      localStore.beneficiarios.unshift(nuevo);
      return nuevo;
    }
  );
}

export async function obtenerSolicitudesApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/solicitudes'), ['solicitudes']),
    () => [...localStore.solicitudes]
  );
}

export async function crearSolicitudApi(datos) {
  return await consultarConFallback(
    () => api.post('/api/solicitudes', datos),
    () => {
      const nueva = {
        ID_Solicitud: localStore.solicitudes.length + 1,
        ...datos,
      };
      localStore.solicitudes.unshift(nueva);
      return nueva;
    }
  );
}

export async function obtenerEquiposApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/equipos'), ['equipos']),
    () => localStore.equipos.map((eq) => ({ ...eq }))
  );
}

export async function actualizarEstadoEquipoApi(idEquipo, nuevoEstado, equipoActual = {}) {
  return await consultarConFallback(
    async () => {
      try {
        return await api.put(`/api/equipos/${idEquipo}`, {
          ...equipoActual,
          Estado_equipo: nuevoEstado,
        });
      } catch {
        return await api.put(`/api/equipos/${idEquipo}/estado`, {
          Estado_equipo: nuevoEstado,
        });
      }
    },
    () => {
      const eq = localStore.equipos.find(
        (item) => Number(item.ID_Equipo ?? item.id) === Number(idEquipo)
      );
      if (eq) eq.Estado_equipo = nuevoEstado;
      return eq || { ID_Equipo: Number(idEquipo), Estado_equipo: nuevoEstado };
    }
  );
}

export async function obtenerAsignacionesApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/asignaciones'), ['asignaciones']),
    () => [...localStore.asignaciones]
  );
}

export async function crearAsignacionApi(datos, equipoSeleccionado = null, beneficiarioNombre = '') {
  if (USAR_FALLBACK_LOCAL) {
    try {
      const asignacionCreada = await api.post('/api/asignaciones', datos);
      const idAsignacion =
        asignacionCreada?.ID_Asignacion ??
        asignacionCreada?.id ??
        asignacionCreada?.data?.ID_Asignacion ??
        null;

      const esEntrega = datos.Estado === 'Entregada' || Boolean(datos.Fecha_entrega);
      if (datos.ID_Equipo && esEntrega) {
        try {
          await actualizarEstadoEquipoApi(datos.ID_Equipo, 'Asignado', equipoSeleccionado || {});
        } catch {
          // Si ya lo actualizó el backend, continuamos
        }

        const fechaMov = `${datos.Fecha_entrega || new Date().toISOString().split('T')[0]} 12:00:00`;
        const ubicacionAnterior = equipoSeleccionado?.Estado_equipo
          ? `Almacén (${equipoSeleccionado.Estado_equipo})`
          : 'Almacén ReparaTec';
        const ubicacionNueva = beneficiarioNombre
          ? `${beneficiarioNombre} — Asignado`
          : 'Asignado a Beneficiario';

        try {
          await api.post('/api/historial-equipos', {
            ID_Equipo: Number(datos.ID_Equipo),
            ID_Asignacion: idAsignacion ? Number(idAsignacion) : null,
            Fecha_movimiento: fechaMov,
            Tipo_movimiento: 'Entrega',
            Descripcion: `Entrega vinculada a asignación${idAsignacion ? ` #${idAsignacion}` : ''} (${datos.Condiciones_entrega})`,
            Ubicacion_anterior: ubicacionAnterior,
            Ubicacion_nueva: ubicacionNueva,
          });
        } catch {
        }
      }
      return asignacionCreada;
    } catch (error) {
      if (!esErrorDeEndpointNoDisponible(error)) throw error;

      const nuevaAsignacion = {
        ID_Asignacion: localStore.asignaciones.length + 1,
        ...datos,
      };
      localStore.asignaciones.unshift(nuevaAsignacion);
      aplicarEntregaLocal(
        datos,
        nuevaAsignacion.ID_Asignacion,
        equipoSeleccionado,
        beneficiarioNombre
      );
      return nuevaAsignacion;
    }
  }

  const asignacionCreada = await api.post('/api/asignaciones', datos);
  const esEntrega = datos.Estado === 'Entregada' || Boolean(datos.Fecha_entrega);

  if (datos.ID_Equipo && esEntrega) {
    const idAsignacion =
      asignacionCreada?.ID_Asignacion ??
      asignacionCreada?.id ??
      asignacionCreada?.data?.ID_Asignacion ??
      null;

    try {
      await actualizarEstadoEquipoApi(datos.ID_Equipo, 'Asignado', equipoSeleccionado || {});
    } catch {
    }

    const fechaMov = `${datos.Fecha_entrega || new Date().toISOString().split('T')[0]} 12:00:00`;
    const ubicacionAnterior = equipoSeleccionado?.Estado_equipo
      ? `Almacén (${equipoSeleccionado.Estado_equipo})`
      : 'Almacén ReparaTec';
    const ubicacionNueva = beneficiarioNombre
      ? `${beneficiarioNombre} — Asignado`
      : 'Asignado a Beneficiario';

    try {
      await api.post('/api/historial-equipos', {
        ID_Equipo: Number(datos.ID_Equipo),
        ID_Asignacion: idAsignacion ? Number(idAsignacion) : null,
        Fecha_movimiento: fechaMov,
        Tipo_movimiento: 'Entrega',
        Descripcion: `Entrega vinculada a asignación${idAsignacion ? ` #${idAsignacion}` : ''} (${datos.Condiciones_entrega})`,
        Ubicacion_anterior: ubicacionAnterior,
        Ubicacion_nueva: ubicacionNueva,
      });
    } catch {
    }
  }

  return asignacionCreada;
}

export async function obtenerEvaluacionesApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/evaluaciones'), ['evaluaciones']),
    () => [...localStore.evaluaciones]
  );
}

export async function crearEvaluacionApi(datos) {
  return await consultarConFallback(
    () => api.post('/api/evaluaciones', datos),
    () => {
      const nueva = {
        ID_Evaluacion: localStore.evaluaciones.length + 1,
        ...datos,
      };
      localStore.evaluaciones.unshift(nueva);
      return nueva;
    }
  );
}

export async function obtenerHistorialEquiposApi() {
  return await consultarConFallback(
    async () => extraerLista(await api.get('/api/historial-equipos'), ['historial', 'historial_equipos']),
    () => [...localStore.historial]
  );
}