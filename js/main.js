const impuesto = 0.1;
const listaArtistas = ["Katy Perry", "ONE OK ROCK", "Simple Minds", "Reik", "Linkin Park"];
const listaArtistasConPrecio = [
    [175, 120, 85],
    [150, 110, 80],
    [130, 100, 70],
    [120, 90, 60],
    [180, 140, 100]
];

let entradasCompradas = [];

function mostrarListaConIndices(lista, titulo = "") {
    let mensaje = titulo;
    for (let i = 0; i < lista.length; i++) {
        mensaje += (i + 1) + ". " + lista[i] + "\n";
    }
    return mensaje;
}

function mostrarPreciosArtista(precios) {
    return "1. Preferencial: $" + precios[0] + 
           "\n2. Platea: $" + precios[1] + 
           "\n3. General: $" + precios[2] + 
           "\n4. Volver al menu anterior.";
}

function calcularPrecio(cantidad, precio) {
    const subtotal = cantidad * precio;
    return subtotal + (subtotal * impuesto);
}

function procesarCompra(artistaIndex, tipoEntradaIndex) {
    const artista = listaArtistas[artistaIndex];
    const precios = listaArtistasConPrecio[artistaIndex];
    const tipoEntrada = ["Preferencial", "Platea", "General"][tipoEntradaIndex];
    const precioBase = precios[tipoEntradaIndex];
    
    const cantidad = parseInt(prompt(`Cuantas entradas ${tipoEntrada} deseas comprar para ${artista}?`));
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad no válida");
        return;
    }
    
    const precioTotal = calcularPrecio(cantidad, precioBase);
    alert(`El precio total para ${cantidad} entradas ${tipoEntrada} de ${artista} es: $${precioTotal}`);
    
    entradasCompradas.push(`${artista} - ${cantidad} entradas ${tipoEntrada} por $${precioTotal}`);
}

function menuCompraArtista(artistaIndex) {
    const precios = listaArtistasConPrecio[artistaIndex];
    let opcionCompra;
    
    do {
        opcionCompra = parseInt(prompt(mostrarPreciosArtista(precios) + 
                      "\nSeleccione tipo de entrada a comprar (1-3) o 4 para volver"));
        
        if (opcionCompra >= 1 && opcionCompra <= 3) {
            procesarCompra(artistaIndex, opcionCompra - 1);
        }
    } while (opcionCompra !== 4);
}

function darBienvenida(nombre) {
    return nombre ? `Hola ${nombre}, estás dentro de la plataforma. Presiona 'Aceptar' para continuar.` :
                   "Listo, estás dentro de la plataforma. Presiona 'Aceptar' para continuar.";
}

let nombre = prompt("Compra tus entradas favoritas a precios bajos en Melos. ¿Cómo te llamas?\n" +
                   "Si deseas mantenerte anónimo solo presiona 'Aceptar'");
alert(darBienvenida(nombre));

let opcionMenu;
do {
    opcionMenu = parseInt(prompt("Elija una opción:\n1. Ver lista de conciertos disponibles\n" +
                                "2. Ver mis entradas compradas\n3. Salir"));
    
    switch (opcionMenu) {
        case 1:
            let opcionConcierto;
            do {
                opcionConcierto = parseInt(prompt(mostrarListaConIndices(listaArtistas, "Conciertos disponibles:\n") +
                                      `\nSeleccione un concierto (1-${listaArtistas.length}) o ${listaArtistas.length + 1} para volver`));
                
                if (opcionConcierto >= 1 && opcionConcierto <= listaArtistas.length) {
                    menuCompraArtista(opcionConcierto - 1);
                }
            } while (opcionConcierto !== listaArtistas.length + 1);
            break;
            
        case 2:
            if (entradasCompradas.length === 0) {
                alert("Aún no has comprado ninguna entrada.");
            } else {
                alert(mostrarListaConIndices(entradasCompradas, "Tus entradas compradas:\n"));
            }
            break;
            
        case 3:
            break;
            
        default:
            alert("Opción no válida, intenta de nuevo.");
    }
} while (opcionMenu !== 3);

alert("¡Hasta pronto!");