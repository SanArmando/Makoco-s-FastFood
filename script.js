let carrito = [];

function agregarAlCarrito(producto, precio) {
    carrito.push({ producto, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('carrito');
    listaCarrito.innerHTML = '';

    carrito.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = `${item.producto} - $${item.precio.toFixed(2)}`;
        listaCarrito.appendChild(li);
    });
}

function realizarPedido() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    alert('Pedido realizado con éxito. ¡Gracias por tu compra!');
    carrito = [];
    actualizarCarrito();
}
