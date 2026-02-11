// --- VARIABLES GLOBALES Y SELECTORES DOM ---
let inventario = [];
let carrito = [];

const contenedorProductos = document.getElementById('contenedor-productos');
const carritoItemsContainer = document.getElementById('carrito-items');
const precioTotalElement = document.getElementById('precio-total');
const formulario = document.getElementById('form-presupuesto');

// --- 1. CARGA DE DATOS (Fetch & Async/Await) ---
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

const fetchData = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Error en la conexión');
        inventario = await response.json();
        renderizarProductos(inventario);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Sistema',
            text: 'No se pudo cargar el inventario. Intente más tarde.',
        });
    }
};

// --- 2. RENDERIZADO (DOM) ---
function renderizarProductos(productos) {
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('col-md-4', 'col-sm-6');

        div.innerHTML = `
            <div class="card h-100 producto-card">
                <div class="card-img-top-placeholder text-secondary">
                    ${producto.imagen}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small">${producto.tipo}</p>
                    <h6 class="mt-auto text-primary">$${producto.precio.toLocaleString()}</h6>
                    <button class="btn btn-outline-primary mt-2" onclick="agregarAlCarrito(${producto.id})">
                        Agregar +
                    </button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });
}

// --- 3. LÓGICA DE NEGOCIO (Carrito) ---

window.agregarAlCarrito = (id) => {
    const productoEncontrado = inventario.find(item => item.id === id);

    if (productoEncontrado) {
        carrito.push(productoEncontrado);
        actualizarCarritoUI();

        // Notificación con Toastify (Reemplaza alert)
        Toastify({
            text: `Agregado: ${productoEncontrado.nombre}`,
            duration: 2000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
};

window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    actualizarCarritoUI();

    Toastify({
        text: "Item eliminado",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#dc3545",
        }
    }).showToast();
};

function actualizarCarritoUI() {
    // Limpiar HTML
    carritoItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        carritoItemsContainer.innerHTML = '<li class="list-group-item text-center text-muted">El presupuesto está vacío.</li>';
        precioTotalElement.innerText = '0';
        return;
    }

    // Generar items del carrito
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold" style="font-size: 0.9rem;">${item.nombre}</div>
                <span class="badge bg-secondary rounded-pill">$${item.precio}</span>
            </div>
            <button class="btn btn-sm btn-link text-secondary btn-eliminar" onclick="eliminarDelCarrito(${index})">
                <i class="bi bi-trash">X</i>
            </button>
        `;
        carritoItemsContainer.appendChild(li);
    });

    // Calcular Total con reduce()
    const total = carrito.reduce((acc, item) => acc + item.precio, 0);
    precioTotalElement.innerText = total.toLocaleString();
}

// --- 4. INTERACCIÓN FINAL (Formulario) ---

formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recarga de página

    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'Debes agregar repuestos o servicios antes de generar la orden.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const nombreCliente = document.getElementById('cliente').value;
    const sucursal = document.getElementById('sucursal').value;
    const totalFinal = document.getElementById('precio-total').innerText;

    // Simulación de proceso exitoso con SweetAlert2
    Swal.fire({
        title: '¡Orden Generada!',
        html: `
            <p>Cliente: <strong>${nombreCliente}</strong></p>
            <p>Sucursal: ${sucursal}</p>
            <p class="fs-4">Total a cobrar: <strong>$${totalFinal}</strong></p>
        `,
        icon: 'success',
        confirmButtonText: 'Imprimir Comprobante'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reiniciar el simulador
            carrito = [];
            actualizarCarritoUI();
            formulario.reset();
            // Restaurar valor por defecto del técnico tras el reset
            document.getElementById('tecnico').value = "Fede";
            document.getElementById('sucursal').value = "Villa Carlos Paz, Córdoba";
        }
    });
});