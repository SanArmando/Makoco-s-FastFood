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
  let carrito = [];

  // Cargar carrito desde localStorage al iniciar
  window.onload = function() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) {
      carrito = JSON.parse(guardado);
      actualizarCarrito();
    }
  };

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

  // Vaciar carrito
  function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem('carrito');
    mostrarConfirmacion('Carrito vaciado');
  }

  // Actualizar la lista del carrito y el total
  function actualizarCarrito() {
    const listaPedido = document.getElementById('lista-pedido');
    const totalPedido = document.getElementById('total-pedido');
    listaPedido.innerHTML = '';
    let total = 0;
    carrito.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `${item.producto} - $${item.precio.toFixed(2)} 
      <button onclick="eliminarProducto(${idx})" aria-label="Eliminar ${item.producto}">❌</button>`;
      listaPedido.appendChild(li);
      total += item.precio;
    });
    totalPedido.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Eliminar producto individual
  function eliminarProducto(idx) {
    carrito.splice(idx, 1);
    actualizarCarrito();
    mostrarConfirmacion('Producto eliminado');
  }

  // Vaciar carrito
  function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem('carrito');
    mostrarConfirmacion('Carrito vaciado');
  }

  // Mostrar confirmación visual
  function mostrarConfirmacion(mensaje) {
    const confirmacion = document.getElementById('confirmacion-carrito');
    confirmacion.textContent = mensaje;
    confirmacion.style.display = 'block';
    setTimeout(() => { confirmacion.style.display = 'none'; }, 2000);
  }

  // Finalizar pedido y mostrar recibo en modal
  function realizarPedido() {
    if (carrito.length === 0) {
        mostrarConfirmacion('El carrito está vacío.');
        return;
    }
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
    let recibo = 'Pedido:\n';
    let total = 0;
    carrito.forEach(item => {
        recibo += `${item.producto} - $${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });
    recibo += `Método de pago: ${metodoPago}\nTotal: $${total.toFixed(2)}`;

    // Guardar en historial
    let historial = JSON.parse(localStorage.getItem('historialPedidos') || '[]');
    historial.push({ pedido: recibo, fecha: new Date().toLocaleString() });
    localStorage.setItem('historialPedidos', JSON.stringify(historial));

    mostrarModalRecibo(recibo);
    enviarMensajeAdministrador(recibo);
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem('carrito');
  }

  // Modal para recibo
  function mostrarModalRecibo(recibo) {
    document.getElementById('contenido-recibo').textContent = recibo;
    document.getElementById('modal-recibo').style.display = 'block';
    document.getElementById('modal-recibo').focus();
  }
  function cerrarModalRecibo() {
    document.getElementById('modal-recibo').style.display = 'none';
  }
  window.onclick = function(event) {
    if (event.target == document.getElementById('modal-recibo')) cerrarModalRecibo();
  }

  // Simulación de mensaje al administrador
  function enviarMensajeAdministrador(mensaje) {
    console.log('Mensaje al administrador:', mensaje);
    // Aquí puedes integrar un servicio real si lo deseas
  }

  agregarAlCarrito('Hamburguesa', 5.99);
  agregarAlCarrito('Papas Fritas', 2.99);
});
