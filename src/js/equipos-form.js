import { cargarParciales } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const form = document.getElementById('form-equipo');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const codigoInput = document.getElementById('Codigo_inventario');
    const marcaInput = document.getElementById('Marca');
    const modeloInput = document.getElementById('Modelo');
    const serieInput = document.getElementById('Numero_de_serie');
    const estadoSelect = document.getElementById('Estado_equipo');

    document.getElementById('error-Codigo_inventario').textContent = '';
    document.getElementById('error-Marca').textContent = '';
    document.getElementById('error-Modelo').textContent = '';
    document.getElementById('error-Numero_de_serie').textContent = '';
    document.getElementById('error-Estado_equipo').textContent = '';

    let esValido = true;

    if (!codigoInput.value.trim()) {
      document.getElementById('error-Codigo_inventario').textContent = 'El código de inventario es obligatorio.';
      esValido = false;
    }
    if (!marcaInput.value.trim()) {
      document.getElementById('error-Marca').textContent = 'La marca es obligatoria.';
      esValido = false;
    }
    if (!modeloInput.value.trim()) {
      document.getElementById('error-Modelo').textContent = 'El modelo es obligatorio.';
      esValido = false;
    }
    if (!serieInput.value.trim()) {
      document.getElementById('error-Numero_de_serie').textContent = 'El número de serie es obligatorio.';
      esValido = false;
    }
    if (!estadoSelect.value) {
      document.getElementById('error-Estado_equipo').textContent = 'Debe seleccionar un estado para el equipo.';
      esValido = false;
    }

    if (esValido) {
      alert('¡Equipo validado y registrado exitosamente (Simulación)!');
      window.location.href = '/equipos.html';
    }
  });
});