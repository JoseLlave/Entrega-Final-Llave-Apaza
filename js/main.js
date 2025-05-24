document.addEventListener('DOMContentLoaded', function() {
    cargarDatosConciertos();
    configurarEventosIniciales();
    mostrarOrdenesCompradas();
});

let conciertosData = [];

function cargarDatosConciertos() {
    try {
        fetch('db/data.json')
            .then(response => {
                if (!response.ok) {
                    mostrarFeedback('No se pudieron cargar los conciertos');
                    document.getElementById('lista-conciertos-container').innerHTML = 
                        '<li class="sin-resultados">Error al cargar los conciertos. Por favor intenta más tarde.</li>';
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    conciertosData = data;
                    mostrarListaConciertos(data);
                    configurarEventosConciertos();
                }
            })
            .catch(() => {
                mostrarFeedback('No se pudieron cargar los conciertos');
                document.getElementById('lista-conciertos-container').innerHTML = 
                    '<li class="sin-resultados">Error al cargar los conciertos. Por favor intenta más tarde.</li>';
            });
    } catch {
        mostrarFeedback('Ocurrio un problema inesperado');
        document.getElementById('lista-conciertos-container').innerHTML = 
            '<li class="sin-resultados">Error inesperado. Por favor recarga la página.</li>';
    }
}

function mostrarListaConciertos(conciertos) {
    const listaConciertosContainer = document.getElementById('lista-conciertos-container');
    if (!listaConciertosContainer) return;
    
    listaConciertosContainer.innerHTML = '';
    
    if (conciertos.length === 0) {
        listaConciertosContainer.innerHTML = '<li class="sin-resultados">No se encontraron conciertos</li>';
        return;
    }

    conciertos.forEach(concierto => {
        const item = document.createElement('li');
        item.innerHTML = `
            <img src="${concierto.imagen}" alt="Concierto ${concierto.artista}" class="imagen-concierto">
            <div class="info-concierto">
                <div class="datos-principales">
                    <h3>${concierto.artista} - ${concierto.tour}</h3>
                    <h4>${concierto.lugar}</h4>
                    <p class="fecha">📅 ${concierto.fecha}</p>
                </div>
                <div class="informacion-adicional">
                    <p class="precios">💲 Precios: $${concierto.precios[0]} (Preferencial) | $${concierto.precios[1]} (Platea) | $${concierto.precios[2]} (General)</p>
                    <p class="disponibilidad" data-id="${concierto.id}">🎟️ Entradas disponibles: ${concierto.disponibilidad}</p>
                </div>
                <div class="opciones-compra">
                    <select class="select-tipo" data-id="${concierto.id}">
                        <option value="0">Preferencial ($${concierto.precios[0]})</option>
                        <option value="1">Platea ($${concierto.precios[1]})</option>
                        <option value="2">General ($${concierto.precios[2]})</option>
                    </select>
                    <div class="controles-compra">
                        <input type="number" class="input-cantidad" data-id="${concierto.id}" min="1" max="${concierto.disponibilidad}" value="1">
                        <button class="btn-comprar" data-id="${concierto.id}">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        listaConciertosContainer.appendChild(item);
    });
}

function configurarEventosIniciales() {
    const formPagar = document.getElementById('form-pagar');
    if (formPagar) {
        formPagar.addEventListener('submit', function(e) {
            if (getCarrito().length === 0) {
                e.preventDefault();
                mostrarFeedback('El carrito esta vacio');
            }
        });
    }
}

function configurarEventosConciertos() {
    const inputBusqueda = document.getElementById('input-busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function(e) {
            const termino = e.target.value.toLowerCase();
            let resultados;
            
            if (termino === '') {
                resultados = conciertosData;
            } else {
                resultados = conciertosData.filter(concierto => 
                    concierto.artista.toLowerCase().includes(termino) || 
                    concierto.tour.toLowerCase().includes(termino)
                );
            }
            
            mostrarListaConciertos(resultados);
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const selectTipo = document.querySelector(`.select-tipo[data-id="${id}"]`);
            const inputCantidad = document.querySelector(`.input-cantidad[data-id="${id}"]`);
            
            if (!selectTipo || !inputCantidad) return;
            
            const tipoEntrada = parseInt(selectTipo.value);
            const cantidad = parseInt(inputCantidad.value);
            
            if (isNaN(cantidad) || cantidad < 1) {
                mostrarFeedback('Cantidad no valida');
                inputCantidad.value = 1;
                return;
            }

            const concierto = conciertosData.find(c => c.id === id);
            if (!concierto) {
                mostrarFeedback('Concierto no encontrado');
                return;
            }

            if (cantidad > concierto.disponibilidad) {
                mostrarFeedback(`Solo quedan ${concierto.disponibilidad} entradas disponibles`);
                inputCantidad.value = Math.min(cantidad, concierto.disponibilidad);
                return;
            }

            const entrada = agregarAlCarrito(concierto, tipoEntrada, cantidad);
            if (entrada) {
                mostrarFeedback(`✔️ ${cantidad} entrada(s) ${entrada.tipo} para ${concierto.artista} agregada(s) al carrito`);

                const disponibilidadElement = document.querySelector(`.disponibilidad[data-id="${id}"]`);
                if (disponibilidadElement) {
                    disponibilidadElement.textContent = `🎟️ Entradas disponibles: ${concierto.disponibilidad}`;
                    inputCantidad.max = concierto.disponibilidad;
                }
                
                if (concierto.disponibilidad === 0) {
                    inputCantidad.disabled = true;
                    e.target.disabled = true;
                    e.target.textContent = 'AGOTADO';
                }
            }
        }

        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.getAttribute('data-id');
            const entradaEliminada = eliminarDelCarrito(id);
            
            if (entradaEliminada) {
                mostrarFeedback(`${entradaEliminada.cantidad} entrada(s) ${entradaEliminada.tipo} para ${entradaEliminada.artista} eliminada(s)`);
                
                const concierto = conciertosData.find(c => c.id === entradaEliminada.conciertoId);
                if (concierto) {
                    concierto.disponibilidad += entradaEliminada.cantidad;
                    const disponibilidadElement = document.querySelector(`.disponibilidad[data-id="${concierto.id}"]`);
                    if (disponibilidadElement) {
                        disponibilidadElement.textContent = `🎟️ Entradas disponibles: ${concierto.disponibilidad}`;
                    }
                }

            }
        }
    });
}

function mostrarOrdenesCompradas() {
    const contenedorOrdenes = document.getElementById('ordenes-container');
    const ordenesGuardadas = localStorage.getItem('entradasCompradas');
    
    contenedorOrdenes.innerHTML = '';
    
    if (!ordenesGuardadas || ordenesGuardadas === '') {
        contenedorOrdenes.innerHTML = '<li class="sin-ordenes">No hay ordenes registradas</li>';
        return;
    }
    
    const ordenes = ordenesGuardadas.split('|');
    const ordenesAgrupadas = {};
    
    ordenes.forEach((entradaStr, index) => {
        const datos = entradaStr.split(',');
        if (datos.length === 9) {
            const ordenId = `ORD-${Math.floor(index / 3)}`;
            
            if (!ordenesAgrupadas[ordenId]) {
                ordenesAgrupadas[ordenId] = {
                    entradas: [],
                    total: 0
                };
            }
            
            const entrada = {
                id: datos[0],
                artista: datos[2],
                tour: datos[3],
                tipo: datos[4],
                cantidad: parseInt(datos[5]),
                precioTotal: parseFloat(datos[7]),
                imagen: datos[8]
            };
            
            ordenesAgrupadas[ordenId].entradas.push(entrada);
            ordenesAgrupadas[ordenId].total += entrada.precioTotal;
        }
    });
    
    Object.keys(ordenesAgrupadas).forEach(ordenId => {
        const orden = ordenesAgrupadas[ordenId];
        const ordenElement = document.createElement('li');
        ordenElement.className = 'orden-item';
        
        const fechaCompra = new Date();
        fechaCompra.setDate(fechaCompra.getDate() - Object.keys(ordenesAgrupadas).length + 
                          parseInt(ordenId.split('-')[1]));
        
        ordenElement.innerHTML = `
            <div class="orden-header">
                <span class="orden-id">${ordenId}</span>
                <span class="orden-fecha">${fechaCompra.toLocaleDateString()}</span>
            </div>
            <div class="orden-entradas">
                ${orden.entradas.map(entrada => `
                    <div class="entrada-item">
                        <img src="${entrada.imagen}" alt="${entrada.artista}">
                        <div class="entrada-info">
                            <h4>${entrada.artista} - ${entrada.tour}</h4>
                            <p>${entrada.cantidad} x ${entrada.tipo} - $${entrada.precioTotal.toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="orden-total">
                Total: <span>$${orden.total.toFixed(2)}</span>
            </div>
        `;
        
        contenedorOrdenes.appendChild(ordenElement);
    });
}