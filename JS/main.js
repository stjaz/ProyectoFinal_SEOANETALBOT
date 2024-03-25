let carrito = [];

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarProductos();
    cargarCarritoDesdeStorage();
    actualizarCarrito();
    document.getElementById('realizar-compra-btn').addEventListener('click', () => realizarCompra());
});

async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch('./JS/productos.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
}

async function mostrarProductos() {
    const productos = await cargarProductosDesdeJSON();
    const productosContainer = document.getElementById('productos');

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto');
        productoElement.id = `producto-${producto.id}`;
        productoElement.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });
}

function agregarAlCarrito(id) {
    cargarProductosDesdeJSON()
        .then(productos => {
            const productoEnCarrito = carrito.find(item => item.id === id);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                const producto = productos.find(item => item.id === id);
                carrito.push({...producto, cantidad: 1});
            }
            actualizarCarrito();
            mostrarConfirmacionModal();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const listItem = document.createElement('li');
        listItem.textContent = `${producto.nombre} x ${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`;
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.addEventListener('click', () => eliminarDelCarrito(producto.id));
        listItem.appendChild(eliminarBtn);
        
        listaCarrito.appendChild(listItem);
        total += producto.precio * producto.cantidad;
    });

    const totalElement = document.getElementById('total');
    totalElement.textContent = `${total.toFixed(2)}`;

    document.getElementById('carrito').style.display = 'block';
}

function mostrarConfirmacionModal() {
    const modal = document.getElementById('confirmacion-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000); 
}

function realizarCompra() {
    const usuarioRegistrado = confirm('¿Estás registrado?');
    if (usuarioRegistrado) {
        const totalCompra = parseFloat(document.getElementById('total').textContent);
        mostrarMensajeModal(`Compra realizada con éxito. El total es de $${totalCompra.toFixed(2)}. Gracias por tu compra!`);
        carrito = [];
        actualizarCarrito();
    } else {
        mostrarMensajeModal('Debes estar registrado para realizar una compra. Por favor, regístrate.');
    }
}

function mostrarMensajeModal(mensaje) {
    const modalMensaje = document.getElementById('mensaje-modal');
    const mensajeTexto = document.getElementById('mensaje-texto');
    mensajeTexto.textContent = mensaje;
    modalMensaje.style.display = 'block';
}

function cerrarMensajeModal() {
    const modalMensaje = document.getElementById('mensaje-modal');
    modalMensaje.style.display = 'none';
}

document.getElementById('cerrar-mensaje-btn').addEventListener('click', cerrarMensajeModal);

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarProductos();
    cargarCarritoDesdeStorage();
    actualizarCarrito();
    document.getElementById('realizar-compra-btn').addEventListener('click', () => realizarCompra());
    document.getElementById('registrar-usuario-btn').addEventListener('click', registrarUsuario);
});

function realizarCompra() {
    const usuarioRegistrado = validarUsuarioRegistrado();
    if (usuarioRegistrado) {
        const totalCompra = parseFloat(document.getElementById('total').textContent);
        mostrarMensajeModal(`Compra realizada con éxito. Gracias por confiar en nosotros!`);
        carrito = [];
        actualizarCarrito();
    } else {
        mostrarMensajeModal('Debes estar registrado para realizar una compra. Por favor, regístrate.');
        document.getElementById('registro-usuario').style.display = 'block';
    }
    
}

function registrarUsuario() {
    const nombreUsuario = document.getElementById('nombre-usuario').value;
    const contraseña = document.getElementById('contraseña').value;
    localStorage.setItem('usuario', JSON.stringify({nombreUsuario, contraseña}));
    document.getElementById('registro-usuario').style.display = 'none';
}

function validarUsuarioRegistrado() {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? true : false;
}
