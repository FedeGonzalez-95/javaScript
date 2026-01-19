// Array de productos estáticos
const productos = [
    { id: 1, nombre: 'Laptop', precio: 1000, stock: 5 },
    { id: 2, nombre: 'Mouse', precio: 20, stock: 10 },
    { id: 3, nombre: 'Teclado', precio: 50, stock: 8 }
];

// Carrito como array de objetos
let carrito = [];

// Cargar productos desde localStorage al iniciar
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoDOM();
    }
}

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Renderizar productos en el DOM
function renderizarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = ''; // Limpiar contenido anterior
    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button data-id="${producto.id}">Agregar al Carrito</button>
        `;
        listaProductos.appendChild(divProducto);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === parseInt(idProducto));
    if (!producto || producto.stock <= 0) {
        alert('Producto no disponible o sin stock.');
        return;
    }
    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    producto.stock--; // Reducir stock
    guardarCarritoEnStorage();
    actualizarCarritoDOM();
}

// Actualizar el carrito en el DOM
function actualizarCarritoDOM() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total');
    listaCarrito.innerHTML = ''; // Limpiar
    let total = 0;
    carrito.forEach(item => {
        const divItem = document.createElement('div');
        divItem.innerHTML = `<p>${item.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${item.precio * item.cantidad}</p>`;
        listaCarrito.appendChild(divItem);
        total += item.precio * item.cantidad;
    });
    totalSpan.textContent = total;
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    // Restaurar stock
    productos.forEach(p => {
        if (p.id === 1) p.stock = 5;
        if (p.id === 2) p.stock = 10;
        if (p.id === 3) p.stock = 8;
    });
    guardarCarritoEnStorage();
    actualizarCarritoDOM();
    renderizarProductos(); // Actualizar stock
}

// Delegación para botones dinámicos
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    cargarCarritoDesdeStorage();

    // Agregar productos
    document.getElementById('lista-productos').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const idProducto = e.target.getAttribute('data-id');
            agregarAlCarrito(idProducto);
        }
    });

    // Vaciar carrito
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
});