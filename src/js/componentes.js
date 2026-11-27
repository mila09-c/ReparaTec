import { cargarParciales } from './main.js';
import { obtenerComponentes, obtenerDetallesComponentes } from './taller-datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const tbodyComponentes = document.getElementById('tabla-componentes-body');
  const tbodyDetalles = document.getElementById('tabla-detalles-componentes-body');
  const form = document.getElementById('form-componente');

  const [componentes, detalles] = await Promise.all([
    obtenerComponentes(),
    obtenerDetallesComponentes()
  ]);

  const renderComponentes = (lista) => {
    if (!lista || lista.length === 0) {
      tbodyComponentes.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 1.5rem;">
            No hay componentes registrados.
          </td>
        </tr>
      `;
      return;
    }

    tbodyComponentes.innerHTML = lista
      .map(
        (c) => `
        <tr>
          <td>#${c.ID_Componente}</td>
          <td><strong>${c.Nombre_componente}</strong></td>
          <td>${c.Marca} ${c.Modelo}</td>
          <td>${c.Numero_de_serie}</td>
          <td>${c.Descripcion || '—'}</td>
          <td>$${Number(c.Precio || 0).toFixed(2)}</td>
          <td><span class="estado-pill">${c.Existencia} uds</span></td>
        </tr>
      `
      )
      .join('');
  };

  const renderDetalles = (lista) => {
    if (!lista || lista.length === 0) {
      tbodyDetalles.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 1.5rem;">
            No hay detalles de componentes utilizados en reparaciones.
          </td>
        </tr>
      `;
      return;
    }

    tbodyDetalles.innerHTML = lista
      .map(
        (d) => `
        <tr>
          <td>#${d.ID_Detalle}</td>
          <td><strong>${d.Reparacion_Label}</strong><br><small>${d.Equipo_Label}</small></td>
          <td>${d.Nombre_componente}</td>
          <td>${d.Cantidad_utilizada}</td>
          <td>$${Number(d.Costo_unitario || 0).toFixed(2)}</td>
          <td><strong>$${Number(d.Subtotal || 0).toFixed(2)}</strong></td>
        </tr>
      `
      )
      .join('');
  };

  const listaComponentes = [...componentes];
  renderComponentes(listaComponentes);
  renderDetalles(detalles);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    ['Nombre_componente', 'Marca', 'Modelo', 'Numero_de_serie', 'Precio', 'Existencia'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    let valido = true;
    const nombre = document.getElementById('Nombre_componente').value.trim();
    const marca = document.getElementById('Marca').value.trim();
    const modelo = document.getElementById('Modelo').value.trim();
    const serie = document.getElementById('Numero_de_serie').value.trim();
    const precio = document.getElementById('Precio').value.trim();
    const existencia = document.getElementById('Existencia').value.trim();
    const descripcion = document.getElementById('Descripcion').value.trim();

    if (!nombre) {
      document.getElementById('error-Nombre_componente').textContent = 'Ingrese el nombre del componente.';
      valido = false;
    }
    if (!marca) {
      document.getElementById('error-Marca').textContent = 'Ingrese la marca.';
      valido = false;
    }
    if (!modelo) {
      document.getElementById('error-Modelo').textContent = 'Ingrese el modelo.';
      valido = false;
    }
    if (!serie) {
      document.getElementById('error-Numero_de_serie').textContent = 'Ingrese el número de serie.';
      valido = false;
    }
    if (precio === '' || Number(precio) < 0) {
      document.getElementById('error-Precio').textContent = 'Ingrese un precio válido.';
      valido = false;
    }
    if (existencia === '' || Number(existencia) < 0) {
      document.getElementById('error-Existencia').textContent = 'Ingrese una existencia válida.';
      valido = false;
    }

    if (!valido) return;

    listaComponentes.unshift({
      ID_Componente: listaComponentes.length + 1,
      Nombre_componente: nombre,
      Marca: marca,
      Modelo: modelo,
      Numero_de_serie: serie,
      Descripcion: descripcion || '—',
      Precio: Number(precio),
      Existencia: Number(existencia)
    });

    renderComponentes(listaComponentes);
    form.reset();
  });
});