

const URL_API = "https://worker-name.13emilianom2006.workers.dev/";


// =========================================
// ELEMENTOS DEL HTML
// =========================================

const ciudadInput = document.getElementById("ciudadInput");
const buscarBtn = document.getElementById("buscarBtn");

const resultado = document.getElementById("resultado");

const estadoCarga = document.getElementById("estadoCarga");

const estadoError = document.getElementById("estadoError");
const mensajeError = document.getElementById("mensajeError");
const reintentarBtn = document.getElementById("reintentarBtn");

const mensajeValidacion = document.getElementById("mensajeValidacion");

const historialLista = document.getElementById("historialLista");
const mensajeHistorial = document.getElementById("mensajeHistorial");


// =========================================
// HISTORIAL
// =========================================

let historial = [];


// =========================================
// FUNCIÓN PRINCIPAL
// =========================================

async function buscarDatos(ciudad) {

    // Limpiamos mensajes anteriores
    mensajeValidacion.textContent = "";

    // Mostramos estado de carga
    mostrarCarga();

    try {

        // Creamos la URL de la petición
        
      const url = `${URL_API}?ciudad=${encodeURIComponent(ciudad)}`;

        // =====================================
        // FETCH
        // =====================================

        const respuesta = await fetch(url);


        // =====================================
        // COMPROBAR SI LA RESPUESTA ES CORRECTA
        // =====================================

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con la API.");
        }


        // =====================================
        // CONVERTIR RESPUESTA A JSON
        // =====================================

        const datos = await respuesta.json();


        // WeatherAPI puede devolver un error
        // aunque la petición HTTP haya funcionado.
        if (datos.error) {
            throw new Error(datos.error.message);
        }


        // =====================================
        // MOSTRAR RESULTADO
        // =====================================

        mostrarResultado(datos);


        // =====================================
        // GUARDAR EN HISTORIAL
        // =====================================

        agregarAlHistorial(datos.location.name);


    } catch (error) {

        console.error("Error:", error);

        mostrarError(error.message);

    }
}


// =========================================
// MOSTRAR CARGANDO
// =========================================

function mostrarCarga() {

    estadoCarga.classList.remove("oculto");

    estadoError.classList.add("oculto");

    resultado.innerHTML = "";

}


// =========================================
// MOSTRAR RESULTADO
// =========================================

function mostrarResultado(datos) {

    estadoCarga.classList.add("oculto");

    estadoError.classList.add("oculto");


    const ciudad = datos.location.name;
    const pais = datos.location.country;

    const temperatura = datos.current.temp_c;

    const condicion = datos.current.condition.text;

    const icono = datos.current.condition.icon;

    const humedad = datos.current.humidity;

    const viento = datos.current.wind_kph;


    // =====================================
    // CREAR TARJETA
    // =====================================

    resultado.innerHTML = `

        <div class="tarjeta-clima">

            <h2>${ciudad}</h2>

            <p class="pais">
                ${pais}
            </p>

            <img
                class="icono-clima"
                src="https:${icono}"
                alt="${condicion}"
            >

            <p class="temperatura">
                ${temperatura}°C
            </p>

            <p class="condicion">
                ${condicion}
            </p>

            <div class="datos-clima">

                <div class="dato">
                    <strong>${humedad}%</strong>
                    <span>Humedad</span>
                </div>

                <div class="dato">
                    <strong>${viento} km/h</strong>
                    <span>Viento</span>
                </div>

            </div>

        </div>

    `;
}


// =========================================
// MOSTRAR ERROR
// =========================================

function mostrarError(mensaje) {

    estadoCarga.classList.add("oculto");

    resultado.innerHTML = "";

    estadoError.classList.remove("oculto");

    mensajeError.textContent = mensaje;

}


// =========================================
// VALIDAR Y BUSCAR
// =========================================

function realizarBusqueda() {

    const ciudad = ciudadInput.value.trim();


    // =====================================
    // VALIDACIÓN
    // =====================================

    if (ciudad === "") {

        mensajeValidacion.textContent =
            "⚠️ Por favor, escribe una ciudad.";

        ciudadInput.focus();

        return;
    }


    // Realizamos la búsqueda
    buscarDatos(ciudad);

}


// =========================================
// BOTÓN BUSCAR
// =========================================

buscarBtn.addEventListener("click", realizarBusqueda);


// =========================================
// BUSCAR PRESIONANDO ENTER
// =========================================

ciudadInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        realizarBusqueda();

    }

});


// =========================================
// BOTÓN REINTENTAR
// =========================================

reintentarBtn.addEventListener("click", function() {

    const ciudad = ciudadInput.value.trim();

    if (ciudad !== "") {

        buscarDatos(ciudad);

    }

});


// =========================================
// AGREGAR AL HISTORIAL
// =========================================

function agregarAlHistorial(ciudad) {

    // Evitamos duplicados
    historial = historial.filter(
        item => item.toLowerCase() !== ciudad.toLowerCase()
    );


    // Agregamos la ciudad al principio
    historial.unshift(ciudad);


    // Solo guardamos las últimas 5
    historial = historial.slice(0, 5);


    // Actualizamos pantalla
    mostrarHistorial();

}


// =========================================
// MOSTRAR HISTORIAL
// =========================================

function mostrarHistorial() {

    historialLista.innerHTML = "";


    if (historial.length === 0) {

        mensajeHistorial.textContent =
            "Aquí aparecerán tus últimas búsquedas.";

        return;
    }


    mensajeHistorial.textContent =
        "Haz clic en una ciudad para volver a consultar el clima.";


    historial.forEach(function(ciudad) {

        const elemento = document.createElement("span");

        elemento.classList.add("historial-item");

        elemento.textContent = ciudad;


        // Si hacemos clic en una ciudad
        // volvemos a buscarla.
        elemento.addEventListener("click", function() {

            ciudadInput.value = ciudad;

            buscarDatos(ciudad);

        });


        historialLista.appendChild(elemento);

    });

}