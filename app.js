"use strict";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const TIEMPO_LIMITE = 20000;

// Las referencias al DOM se obtienen una sola vez.
const formulario = document.getElementById("formulario");
const titulo = document.getElementById("titulo");
const contenido = document.getElementById("contenido");
const publicar = document.getElementById("publicar");
const textoBoton = document.getElementById("texto-boton");
const indicadorCarga = document.getElementById("indicador-carga");
const estado = document.getElementById("estado");
const errorTitulo = document.getElementById("error-titulo");
const errorContenido = document.getElementById("error-contenido");
const resultado = document.getElementById("resultado");
const resultadoHttp = document.getElementById("resultado-http");
const resultadoId = document.getElementById("resultado-id");
const resultadoTitulo = document.getElementById("resultado-titulo-texto");
const resultadoContenido = document.getElementById("resultado-contenido");
const panelRedactar = document.getElementById("panel-redactar");
const panelRespuesta = document.getElementById("panel-respuesta");
const respuestaVacia = document.getElementById("respuesta-vacia");
const tabRedactar = document.getElementById("tab-redactar");
const tabRespuesta = document.getElementById("tab-respuesta");

// Navegación entre las dos vistas, sin recargar ni perder el texto escrito.
function activarVista(vista) {
  const redactar = vista === "redactar";
  panelRedactar.hidden = !redactar;
  panelRespuesta.hidden = redactar;
  tabRedactar.setAttribute("aria-selected", String(redactar));
  tabRespuesta.setAttribute("aria-selected", String(!redactar));
  tabRedactar.tabIndex = redactar ? 0 : -1;
  tabRespuesta.tabIndex = redactar ? -1 : 0;
}

function navegarConTeclado(event) {
  let vista;
  if (event.key === "Home") vista = "redactar";
  else if (event.key === "End") vista = "respuesta";
  else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    vista = panelRedactar.hidden ? "redactar" : "respuesta";
  } else return;

  event.preventDefault();
  activarVista(vista);
  (vista === "redactar" ? tabRedactar : tabRespuesta).focus();
}

let enviando = false;

function mostrarEstado(mensaje, tipo) {
  estado.textContent = mensaje;
  estado.dataset.tipo = tipo;
}

function cambiarCarga(cargando) {
  enviando = cargando;
  publicar.disabled = cargando;
  titulo.readOnly = cargando;
  contenido.readOnly = cargando;
  indicadorCarga.hidden = !cargando;
  textoBoton.textContent = cargando ? "Publicando…" : "Publicar mensaje";
  formulario.setAttribute("aria-busy", String(cargando));
}

function validarPublicacion(publicacion) {
  const tituloValido = publicacion.title.length > 0;
  const contenidoValido = publicacion.body.length > 0;

  errorTitulo.textContent = tituloValido ? "" : "Escribe un título; no puede contener solo espacios.";
  errorContenido.textContent = contenidoValido ? "" : "Escribe un contenido; no puede contener solo espacios.";
  titulo.setAttribute("aria-invalid", String(!tituloValido));
  contenido.setAttribute("aria-invalid", String(!contenidoValido));

  if (!tituloValido || !contenidoValido) {
    mostrarEstado("Revisa los campos indicados antes de publicar.", "error");
    (tituloValido ? contenido : titulo).focus();
    return false;
  }
  return true;
}

function mostrarResultado(datos, codigoHttp) {
  // textContent presenta el texto de la API sin interpretarlo como HTML.
  resultadoHttp.textContent = `HTTP ${codigoHttp}`;
  resultadoId.textContent = String(datos.id);
  resultadoTitulo.textContent = datos.title;
  resultadoContenido.textContent = datos.body;
  respuestaVacia.hidden = true;
  resultado.hidden = false;
  activarVista("respuesta");
  panelRespuesta.focus({ preventScroll: true });
}

async function enviarPublicacion(event) {
  event.preventDefault();
  // También impide duplicados por Enter o eventos mientras hay un envío activo.
  if (enviando) return;

  resultado.hidden = true;
  respuestaVacia.hidden = false;
  activarVista("redactar");
  const publicacion = {
    title: titulo.value.trim(),
    body: contenido.value.trim()
  };
  if (!validarPublicacion(publicacion)) return;

  cambiarCarga(true);
  mostrarEstado("Enviando la publicación. Espera un momento…", "carga");

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);
  let etapa = "conexion";
  let codigoHttp;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publicacion),
      signal: controlador.signal
    });

    codigoHttp = response.status;
    // Fetch puede resolver su promesa aunque el servidor devuelva 404 o 500.
    if (!response.ok) {
      etapa = "http";
      throw new Error("Respuesta HTTP no satisfactoria");
    }

    etapa = "respuesta";
    const datos = await response.json();
    // Además del JSON válido, se comprueban los datos necesarios para el DOM.
    if (!datos || !Number.isInteger(datos.id) || datos.id <= 0 ||
        typeof datos.title !== "string" || typeof datos.body !== "string") {
      throw new Error("La respuesta no contiene los datos esperados");
    }

    mostrarResultado(datos, codigoHttp);
    mostrarEstado("Publicación enviada correctamente. La API devolvió la respuesta mostrada.", "exito");
  } catch (error) {
    resultado.hidden = true;
    respuestaVacia.hidden = false;
    activarVista("redactar");
    let mensaje;
    if (error.name === "AbortError") {
      mensaje = "La solicitud tardó demasiado. Vuelve a intentarlo.";
    } else if (etapa === "http") {
      mensaje = `El servidor respondió con un error HTTP ${codigoHttp}. Vuelve a intentarlo.`;
    } else if (etapa === "respuesta") {
      mensaje = "No se pudo procesar la respuesta del servidor como una publicación válida. Vuelve a intentarlo.";
    } else {
      mensaje = "No se pudo conectar con la API. Revisa tu conexión y vuelve a intentarlo.";
    }
    mostrarEstado(mensaje, "error");
  } finally {
    // Se ejecuta tanto en éxito como en error y permite realizar nuevos intentos.
    clearTimeout(temporizador);
    cambiarCarga(false);
  }
}

formulario.addEventListener("submit", enviarPublicacion);
tabRedactar.addEventListener("click", () => activarVista("redactar"));
tabRespuesta.addEventListener("click", () => activarVista("respuesta"));
tabRedactar.addEventListener("keydown", navegarConTeclado);
tabRespuesta.addEventListener("keydown", navegarConTeclado);
publicar.disabled = false;
