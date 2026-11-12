export const usuarios = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    correo: "carlos.mendoza@reparatec.mx",
    rol: "Técnico",
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "Ana Torres",
    correo: "ana.torres@reparatec.mx",
    rol: "Administrador",
    estado: "Activo"
  }
];

export async function obtenerUsuarios() {
  return usuarios;
}

export async function obtenerUsuario(id) {
  return usuarios.find((u) => u.id === Number(id)) || null;
}