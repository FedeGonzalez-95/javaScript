// Declaración de constantes
const PRECIOS = {
    manzana: 2,
    pan: 3,
    leche: 5,
    queso: 7
};

// Declaración de variables y arrays
let presupuesto = 20; 
let inventario = [20]; 
let productos = Object.keys(PRECIOS); 
function mostrarMenu() {
    let menu = "Bienvenido a la Tienda Virtual!\n\n";
    menu += "Productos disponibles:\n";
    productos.forEach((producto, index) => {
        menu += `${index + 1}. ${producto} - $${PRECIOS[producto]}\n`;
    });
    menu += `\nTu presupuesto: $${presupuesto}\n`;
    menu += "Opciones:\n1. Comprar producto\n2. Ver inventario\n3. Salir\n";
    alert(menu); // Muestra el menú en un alert
    return prompt("Elige una opción (1-3):"); 
}
function comprarProducto() {
    let eleccion = prompt("Ingresa el nombre del producto que quieres comprar (ej: manzana):").toLowerCase();

    // Condicional para validar si el producto existe
    if (!productos.includes(eleccion)) {
        alert("Producto no encontrado. Intenta de nuevo.");
        console.log("Intento de compra fallido: producto no existe."); 
        return;
    }

    let precio = PRECIOS[eleccion];

    // Condicional para validar si hay suficiente presupuesto
    if (precio > presupuesto) {
        alert("No tienes suficiente dinero para comprar este producto.");
        console.log(`Compra rechazada: presupuesto insuficiente (${presupuesto} < ${precio}).`); 
        return;
    }

    // Confirmación con confirm()
    let confirmar = confirm(`¿Confirmas la compra de ${eleccion} por $${precio}?`);
    if (confirmar) {
        presupuesto -= precio;
        inventario.push(eleccion); 
        alert(`¡Compra exitosa! Has comprado ${eleccion}. Presupuesto restante: $${presupuesto}`);
        console.log(`Compra realizada: ${eleccion}. Inventario actual: ${inventario}. Presupuesto: ${presupuesto}`); 
    } else {
        alert("Compra cancelada.");
        console.log("Compra cancelada por el usuario."); 
    }
}

// Función para mostrar el inventario (genera interacción con alert)
function mostrarInventario() {
    if (inventario.length === 0) {
        alert("Tu inventario está vacío.");
    } else {
        let lista = "Tu inventario:\n";
        // array inventario
        inventario.forEach((item, index) => {
            lista += `${index + 1}. ${item}\n`;
        });
        alert(lista);
    }
    console.log(`Inventario mostrado: ${inventario}`); 
}

// Ciclo principal del simulador 
let continuar = true;
while (continuar) {
    let opcion = mostrarMenu();

    // Condicionales para manejar opciones
    if (opcion === "1") {
        comprarProducto();
    } else if (opcion === "2") {
        mostrarInventario();
    } else if (opcion === "3") {
        continuar = false; 
        alert("¡Gracias por usar la Tienda Virtual!");
        console.log("Simulador terminado."); 
    } else {
        alert("Opción inválida. Intenta de nuevo.");
        console.log("Opción inválida seleccionada."); 
    }
}