import { cargarParciales } from './main.js';
import { obtenerCategorias, obtenerDonaciones } from './datos_equipo.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const categoriaSelect = document.getElementById('ID_Categoria');
  const donacionSelect = document.getElementById('ID_Donacion');
  const fechaInput = document.getElementById('Fecha_registro');

  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().split('T')[0];
  }

  try {
    const [categorias, donaciones] = await Promise.all([
      obtenerCategorias(),
      obtenerDonaciones()
    ]);

    categorias
      .filter((cat) => cat.Estado === 'Activo')
      .forEach((cat) => {
        const option = document.createElement('option');
        option.value = cat.ID_Categoria;
        option.textContent = cat.Nombre_Categoria;
        categoriaSelect.appendChild(option);
      });

    donaciones.forEach((don) => {
      const option = document.createElement('option');
      option.value = don.ID_Donacion;
      option.textContent = `#${don.ID_Donacion} — ${don.Fecha_donacion} (${don.Tipo_entrega})`;
      donacionSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar catálogos de categorías o donaciones:', error);
  }

  const form = document.getElementById('form-equipo');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const campos = [
      { id: 'Codigo_inventario', mensaje: 'El código de inventario es obligatorio.' },
      { id: 'Numero_de_serie', mensaje: 'El número de serie es obligatorio.' },
      { id: 'Marca', mensaje: 'La marca es obligatoria.' },
      { id: 'Modelo', mensaje: 'El modelo es obligatorio.' },
      { id: 'ID_Categoria', mensaje: 'Debe seleccionar una categoría.' },
      { id: 'ID_Donacion', mensaje: 'Debe seleccionar una donación.' },
      { id: 'Perfil_rendimiento', mensaje: 'Debe seleccionar un perfil de rendimiento.' },
      { id: 'Fecha_registro', mensaje: 'La fecha de registro es obligatoria.' },
      { id: 'Estado_equipo', mensaje: 'Debe seleccionar un estado para el equipo.' }
    ];

    campos.forEach(({ id }) => {
      const errorEl = document.getElementById(`error-${id}`);
      if (errorEl) errorEl.textContent = '';
    });

    let esValido = true;

    campos.forEach(({ id, mensaje }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(`error-${id}`);
      const valor = input ? input.value.trim() : '';

      if (!valor) {
        if (errorEl) errorEl.textContent = mensaje;
        esValido = false;
      }
    });

    if (esValido) {
      alert('¡Equipo validado y registrado exitosamente (Simulación)!');
      window.location.href = '/equipos.html';
    }
  });
});