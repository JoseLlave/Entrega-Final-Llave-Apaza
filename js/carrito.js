const impuesto = 0.1;
let carrito = [];
let total = 0;

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    actualizarCarritoUI();
});

const agregarAlCarrito = (concierto, tipo, cantidad) => {
    if (cantidad > concierto.disponibilidad) {
        mostrarFeedback(`Solo quedan ${concierto.disponibilidad} entradas disponibles`);
        return null;
    }

    const tipos = ['Preferencial', 'Platea', 'General'];
    const precioBase = concierto.precios[tipo];
    const precioTotal = parseFloat((precioBase * cantidad * (1 + impuesto)).toFixed(2));
    
    const entrada = {
        id: `${concierto.id}-${tipo}-${Date.now()}`,
        conciertoId: concierto.id,
        artista: concierto.artista,
        tour: concierto.tour,
        tipo: tipos[tipo],
        cantidad: cantidad,
        precioUnitario: precioBase,
        precioTotal: precioTotal,
        imagen: concierto.imagen
    };
    
    const existeIndex = carrito.findIndex(item => item.id === entrada.id);
    try {
        if (cantidad > concierto.disponibilidad) {
            mostrarFeedback(`Solo quedan ${concierto.disponibilidad} entradas disponibles`);
            return null;
        }
        if (existeIndex !== -1) {
            carrito[existeIndex].cantidad += cantidad;
            carrito[existeIndex].precioTotal = parseFloat((
                carrito[existeIndex].precioUnitario * 
                carrito[existeIndex].cantidad * 
                (1 + impuesto)
            ).toFixed(2));
        } else {
            carrito.push(entrada);
        }
        
        concierto.disponibilidad -= cantidad;
        
        guardarCarrito();
        return entrada;
    } catch {
        mostrarFeedback('No se pudo agregar al carrito. Intenta nuevamente.');
        return null;
    }
};

const eliminarDelCarrito = (id) => {
    try {
        const entradaIndex = carrito.findIndex(item => item.id === id);
        if (entradaIndex !== -1) {
            const [entradaEliminada] = carrito.splice(entradaIndex, 1);
            guardarCarrito();
            return entradaEliminada;
        }
        return null;
    } catch {
        mostrarFeedback('No se pudo eliminar la entrada. Intenta nuevamente.');
        return null;
    }
};

const calcularTotal = () => {
    total = parseFloat(carrito.reduce((sum, item) => sum + parseFloat(item.precioTotal), 0).toFixed(2));
    return total;
};

const getCarrito = () => carrito;

const vaciarCarrito = () => {
    carrito = [];
    total = 0;
    guardarCarrito();
};

const guardarCarrito = () => {
    const datosCarrito = carrito.map(item => 
        `${item.id},${item.conciertoId},${item.artista},${item.tour},` +
        `${item.tipo},${item.cantidad},${item.precioUnitario},` +
        `${item.precioTotal},${item.imagen}`
    ).join('|');
    
    localStorage.setItem('carrito', datosCarrito);
    actualizarCarritoUI();
};

const cargarCarrito = () => {
    const datosGuardados = localStorage.getItem('carrito');
    if (datosGuardados) {
        carrito = datosGuardados.split('|')
            .filter(item => item.trim() !== '')
            .map(item => {
                const datos = item.split(',');
                return {
                    id: datos[0],
                    conciertoId: parseInt(datos[1]),
                    artista: datos[2],
                    tour: datos[3],
                    tipo: datos[4],
                    cantidad: parseInt(datos[5]),
                    precioUnitario: parseFloat(datos[6]),
                    precioTotal: parseFloat(datos[7]),
                    imagen: datos[8]
                };
            });
    }
};

const procesarPago = () => {
    if (carrito.length === 0) {
        mostrarFeedback('El carrito está vacío');
        return false;
    }
    return true;
};

const actualizarCarritoUI = () => {
    const carritoContainer = document.getElementById('carrito-container');
    const totalElemento = document.getElementById('total-carrito');
    
    if (!carritoContainer || !totalElemento) return;
    
    carritoContainer.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<li class="carrito-vacio">No hay entradas en el carrito</li>';
    } else {
        carrito.forEach(entrada => {
            const item = document.createElement('li');
            item.innerHTML = `
                <img src="${entrada.imagen}" alt="Entrada ${entrada.artista}">
                <div class="info-entrada">
                    <h3>${entrada.cantidad} Entrada(s) ${entrada.tipo}</h3>
                    <h4>${entrada.artista} - ${entrada.tour}</h4>
                    <p class="precio-total">$${entrada.precioTotal}</p>
                    <button class="btn-eliminar" data-id="${entrada.id}">Eliminar</button>
                </div>
            `;
            carritoContainer.appendChild(item);
        });
    }
    
    totalElemento.textContent = `$${calcularTotal()}`;
};

function mostrarFeedback(mensaje) {
    let icono = 'info';
    
    if (mensaje.includes('Error') || mensaje.includes('❌')) {
        icono = 'error';
    } else if (mensaje.includes('✔️')) {
        icono = 'success';
    }
    
    Swal.fire({
        position: 'top-end',
        icon: icono,
        title: mensaje.replace(/[❌✔️]/g, '').trim(),
        showConfirmButton: false,
        timer: 3000
    });
}