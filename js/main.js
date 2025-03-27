const impuesto = 0.1
const listaArtistas = ["Katy Perry", "ONE OK ROCK", "Simple Minds", "Reik", "Linkin Park"];
const preciosKatyPerry = [175, 120, 85];
const preciosOneOkRock = [150, 110, 80];
const preciosSimpleMinds = [130, 100, 70];
const preciosReik = [120, 90, 60];
const preciosLinkinPark = [180, 140, 100];

const listaArtistasConPrecio = [preciosKatyPerry, preciosOneOkRock, preciosSimpleMinds, preciosReik, preciosLinkinPark];

let entradasCompradas = [];

function mostrarListaConciertos(lista) {
    let mensaje = "";
    for (let i = 0; i < lista.length; i++) {
        mensaje += (i + 1) + ". " + lista[i] + "\n";
    }
    return mensaje;
}

function mostrarListaPrecios(listaDePrecios) {
    return "1. Preferencial: $" + listaDePrecios[0] + "\n2. Platea: $" + listaDePrecios[1] + "\n3. General: $" + listaDePrecios[2] + "\n4. Volver al menu anterior.";
}

function calcularPrecio(cantidadEntradas, precioEntrada) {
    let costo = cantidadEntradas * precioEntrada;
    return costo + (costo * impuesto);
}

function darBienvenida(nombre) {
    if (nombre === "" || nombre === null) {
        return "Listo, estas dentro de la plataforma, presiona 'Aceptar' para continuar.";
    } else {
        return "Hola " + nombre + ", estas dentro de la plataforma, presiona 'Aceptar' para continuar.";
    }
}

let nombre = prompt("Compra tus entradas favoritas a precios bajos en Melos. Como te llamas?\nSi deseas mantenerte anonimo solo presiona 'Aceptar'");
alert(darBienvenida(nombre));

let menuOpciones = parseInt(prompt("Elija una opcion: \n1. Ver lista de conciertos disponibles.\n2. Ver mis entradas compradas.\n3. Salir"));

while (menuOpciones !== 3) {
    switch (menuOpciones) {
        case 1:
            let seleccionDeConcierto = parseInt(prompt(mostrarListaConciertos(listaArtistas) + 
                "\nSeleccione un concierto para ver precios y comprar.\nPresione " + (listaArtistas.length + 1) + " para volver al menu principal."));

            while (seleccionDeConcierto > 0 && seleccionDeConcierto <= listaArtistas.length) {
                let precios = listaArtistasConPrecio[seleccionDeConcierto - 1];

                switch (seleccionDeConcierto) {
                    case 1:
                        let seleccionDeCompra1 = parseInt(prompt(mostrarListaPrecios(precios) + "\nSi deseas comprar escoge una de esas 3 opciones"));

                        while (seleccionDeCompra1 > 0 && seleccionDeCompra1 < 4) {
                            switch (seleccionDeCompra1) {
                                case 1:
                                    let cantidad1 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal1 = calcularPrecio(cantidad1, precios[0]);
                                    alert("El precio total es: $" + precioTotal1);
                                    entradasCompradas.push(listaArtistas[0] + " - " + cantidad1 + " entradas por $" + precioTotal1);
                                    break;
                                case 2:
                                    let cantidad2 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal2 = calcularPrecio(cantidad2, precios[1]);
                                    alert("El precio total es: $" + precioTotal2);
                                    entradasCompradas.push(listaArtistas[0] + " - " + cantidad2 + " entradas por $" + precioTotal2);
                                    break;
                                case 3:
                                    let cantidad3 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal3 = calcularPrecio(cantidad3, precios[2]);
                                    alert("El precio total es: $" + precioTotal3);
                                    entradasCompradas.push(listaArtistas[0] + " - " + cantidad3 + " entradas por $" + precioTotal3);
                                    break;
                            }
                            seleccionDeCompra1 = parseInt(prompt(mostrarListaPrecios(precios)));
                        }
                        break;
                    case 2:
                        let seleccionDeCompra2 = parseInt(prompt(mostrarListaPrecios(precios)));

                        while (seleccionDeCompra2 > 0 && seleccionDeCompra2 < 4) {
                            switch (seleccionDeCompra2) {
                                case 1:
                                    let cantidad4 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal4 = calcularPrecio(cantidad4, precios[0]);
                                    alert("El precio total es: $" + precioTotal4);
                                    entradasCompradas.push(listaArtistas[1] + " - " + cantidad4 + " entradas por $" + precioTotal4);
                                    break;
                                case 2:
                                    let cantidad5 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal5 = calcularPrecio(cantidad5, precios[1]);
                                    alert("El precio total es: $" + precioTotal5);
                                    entradasCompradas.push(listaArtistas[1] + " - " + cantidad5 + " entradas por $" + precioTotal5);
                                    break;
                                case 3:
                                    let cantidad6 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal6 = calcularPrecio(cantidad6, precios[2]);
                                    alert("El precio total es: $" + precioTotal6);
                                    entradasCompradas.push(listaArtistas[1] + " - " + cantidad6 + " entradas por $" + precioTotal6);
                                    break;
                            }
                            seleccionDeCompra2 = parseInt(prompt(mostrarListaPrecios(precios)));
                        }
                        break;
                    case 3:
                        let seleccionDeCompra3 = parseInt(prompt(mostrarListaPrecios(precios)));

                        while (seleccionDeCompra3 > 0 && seleccionDeCompra3 < 4) {
                            switch (seleccionDeCompra3) {
                                case 1:
                                    let cantidad7 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal7 = calcularPrecio(cantidad7, precios[0]);
                                    alert("El precio total es: $" + precioTotal7);
                                    entradasCompradas.push(listaArtistas[2] + " - " + cantidad7 + " entradas por $" + precioTotal7);
                                    break;
                                case 2:
                                    let cantidad8 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal8 = calcularPrecio(cantidad8, precios[1]);
                                    alert("El precio total es: $" + precioTotal8);
                                    entradasCompradas.push(listaArtistas[2] + " - " + cantidad8 + " entradas por $" + precioTotal8);
                                    break;
                                case 3:
                                    let cantidad9 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal9 = calcularPrecio(cantidad9, precios[2]);
                                    alert("El precio total es: $" + precioTotal9);
                                    entradasCompradas.push(listaArtistas[2] + " - " + cantidad9 + " entradas por $" + precioTotal9);
                                    break;
                            }
                            seleccionDeCompra3 = parseInt(prompt(mostrarListaPrecios(precios)));
                        }
                        break;
                    case 4:
                        let seleccionDeCompra4 = parseInt(prompt(mostrarListaPrecios(precios)));

                        while (seleccionDeCompra4 > 0 && seleccionDeCompra4 < 4) {
                            switch (seleccionDeCompra4) {
                                case 1:
                                    let cantidad10 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal10 = calcularPrecio(cantidad10, precios[0]);
                                    alert("El precio total es: $" + precioTotal10);
                                    entradasCompradas.push(listaArtistas[3] + " - " + cantidad10 + " entradas por $" + precioTotal10);
                                    break;
                                case 2:
                                    let cantidad11 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal11 = calcularPrecio(cantidad11, precios[1]);
                                    alert("El precio total es: $" + precioTotal11);
                                    entradasCompradas.push(listaArtistas[3] + " - " + cantidad11 + " entradas por $" + precioTotal11);
                                    break;
                                case 3:
                                    let cantidad12 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal12 = calcularPrecio(cantidad12, precios[2]);
                                    alert("El precio total es: $" + precioTotal12);
                                    entradasCompradas.push(listaArtistas[3] + " - " + cantidad12 + " entradas por $" + precioTotal12);
                                    break;
                            }
                            seleccionDeCompra4 = parseInt(prompt(mostrarListaPrecios(precios)));
                        }
                        break;
                    case 5:
                        let seleccionDeCompra5 = parseInt(prompt(mostrarListaPrecios(precios)));

                        while (seleccionDeCompra5 > 0 && seleccionDeCompra5 < 4) {
                            switch (seleccionDeCompra5) {
                                case 1:
                                    let cantidad13 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal13 = calcularPrecio(cantidad13, precios[0]);
                                    alert("El precio total es: $" + precioTotal13);
                                    entradasCompradas.push(listaArtistas[4] + " - " + cantidad13 + " entradas por $" + precioTotal13);
                                    break;
                                case 2:
                                    let cantidad14 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal14 = calcularPrecio(cantidad14, precios[1]);
                                    alert("El precio total es: $" + precioTotal14);
                                    entradasCompradas.push(listaArtistas[4] + " - " + cantidad14 + " entradas por $" + precioTotal14);
                                    break;
                                case 3:
                                    let cantidad15 = parseInt(prompt("Cuantas entradas desea comprar?"));
                                    let precioTotal15 = calcularPrecio(cantidad15, precios[2]);
                                    alert("El precio total es: $" + precioTotal15);
                                    entradasCompradas.push(listaArtistas[4] + " - " + cantidad15 + " entradas por $" + precioTotal15);
                                    break;
                            }
                            seleccionDeCompra5 = parseInt(prompt(mostrarListaPrecios(precios)));
                        }
                        break;
                }

                seleccionDeConcierto = parseInt(prompt(mostrarListaConciertos(listaArtistas) + 
                    "\nSeleccione un concierto para ver precios y comprar.\nPresione " + (listaArtistas.length + 1) + " para volver al menu principal."));
            }
            break;

        case 2:
            if (entradasCompradas.length === 0) {
                alert("Aun no has comprado ninguna entrada.");
            } else {
                let mensaje = "Tus entradas compradas:\n";
                for (let i = 0; i < entradasCompradas.length; i++) {
                    mensaje += (i + 1) + ". " + entradasCompradas[i] + "\n";
                }
                alert(mensaje);
            }
            break;

        default:
            alert("Opcion no valida, intenta de nuevo.");
    }

    menuOpciones = parseInt(prompt("Elija una opcion: \n1. Ver lista de conciertos disponibles.\n2. Ver mis entradas compradas.\n3. Salir"));
}

alert("Hasta pronto");