document.addEventListener('DOMContentLoaded', function() {
    mostrarResumenEntradas();
    configurarValidaciones();
    
    document.getElementById('formulario-pago').addEventListener('submit', function(e) {
        e.preventDefault();
        confirmarPago();
    });
});

function configurarValidaciones() {
    const campoNombre = document.getElementById('nombre-completo');
    const campoCorreo = document.getElementById('correo-electronico');
    const campoTelefono = document.getElementById('telefono');
    const campoTarjeta = document.getElementById('numero-tarjeta');
    const campoFecha = document.getElementById('fecha-expiracion');
    const campoCVV = document.getElementById('codigo-seguridad');
    
    campoNombre.addEventListener('input', function() {
        const valor = this.value;
        let tieneNumeros = false;
        let nuevoValor = '';
        
        for (let i = 0; i < valor.length; i++) {
            const caracter = valor[i];
            if (caracter >= '0' && caracter <= '9') {
                tieneNumeros = true;
            } else {
                nuevoValor += caracter;
            }
        }
        
        if (tieneNumeros) {
            this.value = nuevoValor;
            mostrarError(this, 'El nombre no debe contener números');
        } else {
            limpiarError(this);
        }
    });
    
    campoCorreo.addEventListener('blur', function() {
        const valor = this.value;
        if (valor && (valor.indexOf('@') === -1 || valor.indexOf('.') === -1)) {
            mostrarError(this, 'Ingrese un correo válido (ejemplo@dominio.com)');
        } else {
            limpiarError(this);
        }
    });
    
    campoTelefono.addEventListener('input', function() {
        let nuevoValor = '';
        const valor = this.value;
        
        for (let i = 0; i < valor.length; i++) {
            const caracter = valor[i];
            if (caracter >= '0' && caracter <= '9') {
                nuevoValor += caracter;
            }
        }

        this.value = nuevoValor.slice(0, 9);
    });
    
    campoTarjeta.addEventListener('input', function() {
        let nuevoValor = '';
        const valor = this.value;
        
        for (let i = 0; i < valor.length; i++) {
            const caracter = valor[i];
            if (caracter >= '0' && caracter <= '9') {
                nuevoValor += caracter;
            }
        }
        
        this.value = nuevoValor.slice(0, 16);
    });
    
    campoFecha.addEventListener('input', function() {
        let nuevoValor = '';
        const valor = this.value;
        
        for (let i = 0; i < valor.length; i++) {
            const caracter = valor[i];
            if (caracter >= '0' && caracter <= '9') {
                nuevoValor += caracter;
            }
        }
        
        if (nuevoValor.length > 2) {
            this.value = nuevoValor.slice(0, 2) + '/' + nuevoValor.slice(2, 4);
        } else {
            this.value = nuevoValor;
        }
    });
    
    campoCVV.addEventListener('input', function() {
        let nuevoValor = '';
        const valor = this.value;
        
        for (let i = 0; i < valor.length; i++) {
            const caracter = valor[i];
            if (caracter >= '0' && caracter <= '9') {
                nuevoValor += caracter;
            }
        }
        
        this.value = nuevoValor.slice(0, 4);
    });
}

function mostrarError(campo, mensaje) {
    limpiarError(campo);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-validacion';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
    campo.classList.add('error');
}

function limpiarError(campo) {
    const errorDiv = campo.parentNode.querySelector('.error-validacion');
    if (errorDiv) {
        campo.parentNode.removeChild(errorDiv);
    }
    campo.classList.remove('error');
}

function mostrarResumenEntradas() {
    const resumenContainer = document.getElementById('resumen-entradas-container');
    const totalPagarElement = document.getElementById('total-pagar');
    
    const carritoGuardado = localStorage.getItem('carrito');
    let total = 0;
    
    resumenContainer.innerHTML = '';
    
    if (!carritoGuardado || carritoGuardado === '') {
        resumenContainer.innerHTML = '<li class="sin-entradas">No hay entradas en el carrito</li>';
        totalPagarElement.textContent = '$0.00';
        return;
    }
    
    const carrito = carritoGuardado.split('|')
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
    
    carrito.forEach(entrada => {
        let imagenPath = entrada.imagen;
        if (imagenPath.startsWith('./assets/')) {
            imagenPath = '../' + imagenPath.substring(2);
        }
        
        const item = document.createElement('li');
        item.className = 'entrada-resumen';
        item.innerHTML = `
            <img src="${imagenPath}" alt="Entrada ${entrada.artista}">
            <div class="info-entrada">
                <h3>${entrada.cantidad} Entrada(s) ${entrada.tipo}</h3>
                <h4>${entrada.artista} - ${entrada.tour}</h4>
                <p class="precio-total">$${entrada.precioTotal.toFixed(2)}</p>
            </div>
        `;
        resumenContainer.appendChild(item);
        total += entrada.precioTotal;
    });
    
    totalPagarElement.textContent = `$${total.toFixed(2)}`;
}

function confirmarPago() {
    const nombre = document.getElementById('nombre-completo').value.trim();
    const correo = document.getElementById('correo-electronico').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tarjeta = document.getElementById('numero-tarjeta').value.trim();
    const fecha = document.getElementById('fecha-expiracion').value.trim();
    const cvv = document.getElementById('codigo-seguridad').value.trim();
    const metodo = document.getElementById('metodo-pago').value;
    
    if (!validarDatosPago(nombre, correo, telefono, tarjeta, fecha, cvv, metodo)) {
        return;
    }
    
    Swal.fire({
        title: '¿Confirmar pago?',
        html: `Verifique que los siguientes datos son correctos:<br><br>
               <strong>Nombre:</strong> ${nombre}<br>
               <strong>Correo:</strong> ${correo}<br>
               <strong>Teléfono:</strong> ${telefono}<br>
               <strong>Método:</strong> ${metodo.replace('-', ' de ')}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar pago',
        cancelButtonText: 'Revisar datos'
    }).then((result) => {
        if (result.isConfirmed) {
            procesarPagoReal(nombre, correo, telefono);
        }
    });
}

function validarDatosPago(nombre, correo, telefono, tarjeta, fecha, cvv, metodo) {
    // Validar nombre
    if (!nombre) {
        mostrarError(document.getElementById('nombre-completo'), 'Ingrese su nombre completo');
        return false;
    }
    
    // Validar correo
    if (!correo) {
        mostrarError(document.getElementById('correo-electronico'), 'Ingrese su correo electronico');
        return false;
    }
    if (!correo.includes('@') || !correo.includes('.')) {
        mostrarError(document.getElementById('correo-electronico'), 'El correo debe tener @ y dominio (ejemplo@dominio.com)');
        return false;
    }
    
    // Validar celular
    if (!telefono) {
        mostrarError(document.getElementById('telefono'), 'Ingrese su número de teléfono');
        return false;
    }
    if (telefono.length < 9) {
        mostrarError(document.getElementById('telefono'), 'El celular debe tener 9 dígitos');
        return false;
    }
    
    // Validar tarjeta
    if (!tarjeta) {
        mostrarError(document.getElementById('numero-tarjeta'), 'Ingrese el numero de tarjeta');
        return false;
    }
    if (tarjeta.length < 16) {
        mostrarError(document.getElementById('numero-tarjeta'), 'La tarjeta debe tener 16 digitos');
        return false;
    }
    
    // Validar fecha
    if (!fecha) {
        mostrarError(document.getElementById('fecha-expiracion'), 'Ingrese la fecha de expiración');
        return false;
    }
    if (fecha.length < 5) {
        mostrarError(document.getElementById('fecha-expiracion'), 'Formato: MM/AA');
        return false;
    }
    
    // Validar cvv
    if (!cvv) {
        mostrarError(document.getElementById('codigo-seguridad'), 'Ingrese el codigo de seguridad');
        return false;
    }
    if (cvv.length < 3) {
        mostrarError(document.getElementById('codigo-seguridad'), 'El CVV debe tener 3 o 4 dígitos');
        return false;
    }
    
    // Validar metodo de pago
    if (!metodo) {
        Swal.fire({
            icon: 'error',
            title: 'Método no seleccionado',
            text: 'Seleccione un método de pago',
            confirmButtonColor: '#3085d6'
        });
        return false;
    }
    
    return true;
}

function procesarPagoReal(nombre, correo, telefono) {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        
        if (!carritoGuardado || carritoGuardado === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: 'No hay entradas en el carrito',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        const entradasActuales = localStorage.getItem('entradasCompradas');
        let nuevasEntradas;
        
        if (entradasActuales) {
            nuevasEntradas = `${entradasActuales}|${carritoGuardado}`;
        } else {
            nuevasEntradas = carritoGuardado;
        }
        
        localStorage.setItem('entradasCompradas', nuevasEntradas);

        const carrito = carritoGuardado.split('|')
            .filter(item => item.trim() !== '')
            .map(item => {
                const datos = item.split(',');
                return {
                    conciertoId: parseInt(datos[1]),
                    cantidad: parseInt(datos[5])
                };
            });
        
        let stockActual = JSON.parse(localStorage.getItem('stockActual'));
        if (!stockActual) {
            stockActual = {};
        }
        
        carrito.forEach(item => {
            if (stockActual[item.conciertoId]) {
                stockActual[item.conciertoId] += item.cantidad;
            } else {
                stockActual[item.conciertoId] = item.cantidad;
            }
        });
        
        localStorage.setItem('stockActual', JSON.stringify(stockActual));
        
        vaciarCarrito();
        
        Swal.fire({
            icon: 'success',
            title: '¡Pago exitoso!',
            html: `Gracias ${nombre}, tu compra ha sido procesada.<br>
                Recibiras los detalles en ${correo} y ${telefono}.<br>
                ¡Disfruta del concierto!`,
            confirmButtonColor: '#3085d6'
        }).then(() => {
            const link = document.createElement('a');
            link.href = '../index.html';
            link.click();
        });
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Error en el pago',
            text: 'Ocurrió un problema al procesar tu pago. Por favor intenta nuevamente.',
            confirmButtonColor: '#3085d6'
        });
    }
}