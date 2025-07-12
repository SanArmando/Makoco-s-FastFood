document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.reserva-form');
  const nav = document.querySelector('.nav');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const fecha = form.querySelector('input[type="date"]').value;
    const hora = form.querySelector('input[type="time"]').value;
    const personas = form.querySelector('input[type="number"]').value;

    const msg = document.createElement('div');
    msg.className = 'confirm-msg';
    msg.innerHTML = `
      ¡Gracias <strong>${nombre}</strong>!<br>
      Tu reserva para <strong>${personas}</strong> persona(s) ha sido recibida.<br>
      📅 <strong>${fecha}</strong> a las 🕒 <strong>${hora}</strong><br>
      📧 Confirmación enviada a: <strong>${email}</strong>
    `;
    form.after(msg);
    form.reset();
    setTimeout(() => msg.remove(), 7000);
  });

  // Scroll animado
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Animación en scroll
  const secciones = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  secciones.forEach(seccion => {
    seccion.classList.add('invisible');
    observer.observe(seccion);
  });

  // Navbar blur al hacer scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Lightbox en galería
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  document.body.appendChild(lightbox);

  const galeriaImgs = document.querySelectorAll('.galeria-grid img');
  galeriaImgs.forEach(img => {
    img.addEventListener('click', () => {
      lightbox.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Carrito de compras
  const carrito = [];
  const carritoModal = document.getElementById('carrito-modal');
  const abrirCarritoBtn = document.getElementById('abrir-carrito');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
  const carritoLista = document.getElementById('carrito-lista');
  const carritoTotal = document.getElementById('carrito-total');

  // Agregar producto al carrito
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const producto = this.parentElement.querySelector('h3').textContent;
      const precio = parseInt(this.parentElement.querySelector('.menu-precio').textContent.replace('$',''));
      carrito.push({ producto, precio });
      mostrarMensaje(`${producto} agregado al carrito.`);
      actualizarCarrito();
    });
  });

  // Mostrar mensaje breve
  function mostrarMensaje(texto) {
    const msg = document.createElement('div');
    msg.className = 'confirm-msg';
    msg.innerHTML = `✅ ${texto}`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1800);
  }

  // Mostrar carrito
  abrirCarritoBtn.addEventListener('click', () => {
    carritoModal.classList.add('active');
    actualizarCarrito();
  });

  // Cerrar carrito
  cerrarCarritoBtn.addEventListener('click', () => {
    carritoModal.classList.remove('active');
  });

  // Actualizar lista y total
  function actualizarCarrito() {
    carritoLista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, idx) => {
      total += item.precio;
      const li = document.createElement('li');
      li.innerHTML = `${item.producto} - <strong>$${item.precio}</strong> <button onclick="eliminarDelCarrito(${idx})" style="background:var(--amarillo);color:var(--negro);border:none;border-radius:8px;padding:2px 8px;cursor:pointer;">Eliminar</button>`;
      carritoLista.appendChild(li);
    });
    carritoTotal.textContent = `Total: $${total}`;
  }

  // Eliminar producto del carrito
  window.eliminarDelCarrito = function(idx) {
    carrito.splice(idx, 1);
    actualizarCarrito();
  };
});
