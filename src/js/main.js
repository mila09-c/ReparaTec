const ENLACES_NAV = [
  { texto: 'Inicio', href: '/home.html' },
  { texto: 'Equipos', href: '/home.html#equipos' },
  { texto: 'Solicitudes', href: '/home.html#solicitudes' },
  { texto: 'Contacto', href: '/contact.html' }
];

const ENLACES_FOOTER = [
  { texto: 'Inicio', href: '/home.html' },
  { texto: 'Contacto', href: '/contact.html' },
  { texto: 'Iniciar Sesión', href: '/login.html' }
];

export async function cargarParciales({ mostrarNav = true } = {}) {
  const headerSlot = document.getElementById('header-container');
  const footerSlot = document.getElementById('footer-container');

  if (headerSlot) {
    const resHeader = await fetch('/src/partials/header.html');
    headerSlot.innerHTML = await resHeader.text();
    inicializarHeader(mostrarNav);
  }

  if (footerSlot) {
    const resFooter = await fetch('/src/partials/footer.html');
    footerSlot.innerHTML = await resFooter.text();
    inicializarFooter();
  }
}

function inicializarHeader(mostrarNav) {
  const navList = document.getElementById('header-nav-links');
  const sessionBox = document.getElementById('header-user-session');

  if (navList && mostrarNav) {
    const rutaActual = window.location.pathname;
    navList.innerHTML = ENLACES_NAV.map((item) => {
      const activo = rutaActual.endsWith(item.href) ? 'active' : '';
      return `<li><a href="${item.href}" class="${activo}">${item.texto}</a></li>`;
    }).join('');
  }

  if (sessionBox) {
    const correoActivo = sessionStorage.getItem('usuario_correo');
    if (correoActivo) {
      sessionBox.innerHTML = `
        <span>${correoActivo}</span>
        <button type="button" class="btn-logout" id="btn-cerrar-sesion">Salir</button>
      `;
      document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
        sessionStorage.removeItem('usuario_correo');
        window.location.href = '/login.html';
      });
    } else {
      sessionBox.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;
    }
  }
}

function inicializarFooter() {
  const yearSpan = document.getElementById('footer-year');
  const footerLinks = document.getElementById('footer-links');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (footerLinks) {
    footerLinks.innerHTML = ENLACES_FOOTER.map(
      (link) => `<li><a href="${link.href}">${link.texto}</a></li>`
    ).join('');
  }
}