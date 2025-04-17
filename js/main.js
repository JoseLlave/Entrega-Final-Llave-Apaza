const conciertos = [
    {
      id: 1,
      artista: "Oasis",
      tour: "The Play Tour",
      lugar: "Estadio Nacional, Lima",
      fecha: "15 Noviembre 2024",
      imagen: "https://i.ibb.co/3Y8MjWSg/cancion-Oasis.jpg",
      precios: [175, 120, 85],
      disponibilidad: 1200
    },
    {
      id: 2,
      artista: "Foster the People",
      tour: "Luxury Disease Tour",
      lugar: "Arena Perú, Lima",
      fecha: "22 Diciembre 2024",
      imagen: "https://i.ibb.co/xKK8fnnD/pumped-Of-Kicks.jpg",
      precios: [150, 110, 80],
      disponibilidad: 850
    },
    {
      id: 3,
      artista: "Don Omar",
      tour: "Global Tour",
      lugar: "Teatro Municipal, Lima",
      fecha: "10 Enero 2025",
      imagen: "https://i.ibb.co/xqy1GpGq/danza-Kuduro.jpg",
      precios: [130, 100, 70],
      disponibilidad: 1500
    },
    {
      id: 4,
      artista: "30 Seconds to Mars",
      tour: "Panorama Tour",
      lugar: "Jockey Club, Lima",
      fecha: "5 Febrero 2025",
      imagen: "https://i.ibb.co/MyFVDBh5/bright-Lights.jpg",
      precios: [120, 90, 60],
      disponibilidad: 2000
    },
    {
      id: 5,
      artista: "Calvin Harris",
      tour: "Tribute Tour",
      lugar: "Parque de la Exposición, Lima",
      fecha: "15 Marzo 2025",
      imagen: "https://i.ibb.co/mFt3pfL2/summer.jpg",
      precios: [180, 140, 100],
      disponibilidad: 3000
    }
  ];
  
  // Las variables globales
  const impuesto = 0.1;
  let carrito = [];
  let total = 0;
  let listaActual = [];
  
  for (let i = 0; i < conciertos.length; i++) {
    listaActual.push(conciertos[i]);
  }
  
  const listaConciertosContainer = document.getElementById('lista-conciertos-container');
  const carritoContainer = document.getElementById('carrito-container');
  const totalElemento = document.getElementById('total-carrito');
  const btnPagar = document.getElementById('btn-pagar');
  const inputBusqueda = document.getElementById('input-busqueda');
  const entradasCompradasContainer = document.getElementById('entradas-compradas-container');
  
  document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    mostrarConciertos(conciertos);
    actualizarCarrito();
    mostrarEntradasCompradas();
  });
  
  // Funcion que es para mostrar los conciertos a manera de lista
  function mostrarConciertos(lista) {
    listaConciertosContainer.innerHTML = '';
    
    if (lista.length === 0) {
      listaConciertosContainer.innerHTML = '<li class="sin-resultados">No se encontraron conciertos</li>';
      return;
    }
  
    lista.forEach(function(concierto) {
      const item = document.createElement('li');
      item.innerHTML = `
        <img src="${concierto.imagen}" alt="Concierto ${concierto.artista}">
        <div class="info-concierto">
          <div class="datos-principales">
            <h3>${concierto.artista} - ${concierto.tour}</h3>
            <h4>${concierto.lugar}</h4>
            <p class="fecha">${concierto.fecha}</p>
          </div>
          <div class="informacion-adicional">
            <p class="precios">Precios: $${concierto.precios[0]} (Preferencial) | $${concierto.precios[1]} (Platea) | $${concierto.precios[2]} (General)</p>
            <p class="disponibilidad">Entradas disponibles: ${concierto.disponibilidad}</p>
          </div>
          <div class="opciones-compra">
            <select class="select-tipo" data-id="${concierto.id}">
              <option value="0">Preferencial ($${concierto.precios[0]})</option>
              <option value="1">Platea ($${concierto.precios[1]})</option>
              <option value="2">General ($${concierto.precios[2]})</option>
            </select>
            <input type="number" class="input-cantidad" data-id="${concierto.id}" min="1" max="${concierto.disponibilidad}" value="1">
            <button class="btn-comprar" data-id="${concierto.id}">Agregar al carrito</button>
          </div>
        </div>
      `;
      
      listaConciertosContainer.appendChild(item);
    });
  
    document.querySelectorAll('.btn-comprar').forEach(function(boton) {
      boton.addEventListener('click', function(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const conciertoSeleccionado = listaActual.find(function(c) { return c.id === id; });
        
        if (conciertoSeleccionado) {
          const selectTipo = document.querySelector('.select-tipo[data-id="' + id + '"]');
          const inputCantidad = document.querySelector('.input-cantidad[data-id="' + id + '"]');
          
          const tipoEntrada = parseInt(selectTipo.value);
          const cantidad = parseInt(inputCantidad.value);
          
          if (cantidad > 0 && cantidad <= conciertoSeleccionado.disponibilidad) {
            agregarAlCarrito(conciertoSeleccionado, tipoEntrada, cantidad);
          } else {
            mostrarMensaje('Cantidad no válida');
          }
        }
      });
    });
  }
  
  // Funcion para agregar las entradas al carrito
  function agregarAlCarrito(concierto, tipo, cantidad) {
    const tipos = ['Preferencial', 'Platea', 'General'];
    const precioBase = concierto.precios[tipo];
    const precioTotal = (precioBase * cantidad) * (1 + impuesto);
    
    concierto.disponibilidad -= cantidad;
    
    const entrada = {
      id: concierto.id + '-' + tipo,
      conciertoId: concierto.id,
      artista: concierto.artista,
      tour: concierto.tour,
      tipo: tipos[tipo],
      cantidad: cantidad,
      precioUnitario: precioBase,
      precioTotal: precioTotal,
      imagen: concierto.imagen
    };
    
    const existeIndex = carrito.findIndex(function(item) { return item.id === entrada.id; });
    
    if (existeIndex !== -1) {
      carrito[existeIndex].cantidad += cantidad;
      carrito[existeIndex].precioTotal = (carrito[existeIndex].precioUnitario * carrito[existeIndex].cantidad) * (1 + impuesto);
    } else {
      carrito.push(entrada);
    }
    
    mostrarMensaje(cantidad + ' entrada(s) ' + tipos[tipo] + ' para ' + concierto.artista + ' agregada(s) al carrito');
    guardarCarrito();
    actualizarCarrito();
    mostrarConciertos(listaActual);
  }
  
  // Funcion para actualizar el carrito
  function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    total = 0;
    
    if (carrito.length === 0) {
      carritoContainer.innerHTML = '<li class="carrito-vacio">No hay entradas en el carrito</li>';
    } else {
      carrito.forEach(function(entrada) {
        total += entrada.precioTotal;
        
        const item = document.createElement('li');
        item.innerHTML = `
          <img src="${entrada.imagen}" alt="Entrada ${entrada.artista}">
          <div class="info-entrada">
            <h3>${entrada.cantidad} Entrada(s) ${entrada.tipo}</h3>
            <h4>${entrada.artista} - ${entrada.tour}</h4>
            <p class="precio-total">$${entrada.precioTotal.toFixed(2)}</p>
            <button class="btn-eliminar" data-id="${entrada.id}">Eliminar</button>
          </div>
        `;
        carritoContainer.appendChild(item);
      });
    }
    
    totalElemento.textContent = '$' + total.toFixed(2);
    
    document.querySelectorAll('.btn-eliminar').forEach(function(boton) {
      boton.addEventListener('click', function(e) {
        const id = e.target.getAttribute('data-id');
        eliminarDelCarrito(id);
      });
    });
  }
  
  // Funcion para eliminar una entrada de un concierto del carrito
  function eliminarDelCarrito(id) {
    const entrada = carrito.find(function(item) { return item.id === id; });
    if (entrada) {
      // Encontrar el concierto y devolver las entradas
      const concierto = listaActual.find(function(c) { return c.id === entrada.conciertoId; });
      if (concierto) {
        concierto.disponibilidad += entrada.cantidad;
      }
      
      carrito = carrito.filter(function(item) { return item.id !== id; });
      mostrarMensaje(entrada.cantidad + ' entrada(s) ' + entrada.tipo + ' para ' + entrada.artista + ' eliminada(s)');
      guardarCarrito();
      actualizarCarrito();
      mostrarConciertos(listaActual);
    }
  }
  
  // Mostrar mensajes de interaccion con el usuario
  function mostrarMensaje(texto) {
    const mensajeElement = document.getElementById("mensaje");
    mensajeElement.textContent = texto;
    mensajeElement.style.display = "block";
  }
  
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  }
  
  
  // Funcion que sirve para mostrar las entradas que se compran
  function mostrarEntradasCompradas() {
    const entradasGuardadas = JSON.parse(localStorage.getItem('entradasCompradas')) || [];
    entradasCompradasContainer.innerHTML = '';
    
    if (entradasGuardadas.length === 0) {
      entradasCompradasContainer.innerHTML = '<li class="sin-entradas">No has comprado entradas aún</li>';
      return;
    }
    
    entradasGuardadas.forEach(function(entrada) {
      const item = document.createElement('li');
      item.className = 'entrada-comprada';
      item.innerHTML = `
        <img src="${entrada.imagen}" alt="Entrada ${entrada.artista}" onerror="this.src='img/default.jpg'">
        <div class="info-entrada">
          <h3>${entrada.artista} - ${entrada.tour}</h3>
          <h4>${entrada.tipo} (${entrada.cantidad} entradas)</h4>
          <p><strong>Total:</strong> $${entrada.precioTotal.toFixed(2)}</p>
        </div>
      `;
      entradasCompradasContainer.appendChild(item);
    });
  }
  
  btnPagar.addEventListener('click', function() {
    if (carrito.length > 0) {
      let entradasActuales = [];
      const entradasGuardadas = localStorage.getItem('entradasCompradas');
      if (entradasGuardadas) {
        entradasActuales = JSON.parse(entradasGuardadas);
      }
      
      for (let i = 0; i < carrito.length; i++) {
        entradasActuales.push(carrito[i]);
      }
      
      localStorage.setItem('entradasCompradas', JSON.stringify(entradasActuales));
      
      mostrarMensaje('Compra realizada con éxito. ¡Disfruta del concierto!');
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
      mostrarEntradasCompradas();
    } else {
      mostrarMensaje('El carrito está vacío');
    }
  });
  
  inputBusqueda.addEventListener('input', function(e) {
    const termino = e.target.value.toLowerCase();
    
    if (termino === '') {
      listaActual = [];
      for (let i = 0; i < conciertos.length; i++) {
        listaActual.push(conciertos[i]);
      }
      mostrarConciertos(listaActual);
      return;
    }
    
    listaActual = [];
    for (let i = 0; i < conciertos.length; i++) {
      if (conciertos[i].artista.toLowerCase().includes(termino) || 
          conciertos[i].tour.toLowerCase().includes(termino)) {
        listaActual.push(conciertos[i]);
      }
    }
    
    mostrarConciertos(listaActual);
  });