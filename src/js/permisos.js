export const permisos = {
  'usuarios-lista': ['admin'],
  'usuario-form': ['admin'],
  'usuario-detalle': ['admin'],
};

export function puedeEntrar(pagina, rol) {
  const roles = permisos[pagina];
  return !roles || roles.includes(normalizarRol(rol));
}

export function normalizarRol(rol) {
  if (!rol) return '';
  return String(rol)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}