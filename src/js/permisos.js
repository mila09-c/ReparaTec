export const permisos = {
  'usuarios-lista': ['admin'],
  'usuario-form': ['admin'],
  'usuario-detalle': ['admin'],
};

export function puedeEntrar(pagina, rol) {
  const roles = permisos[pagina];
  return !roles || roles.includes(rol);
}