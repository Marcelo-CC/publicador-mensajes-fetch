# Publicador de Mensajes

Aplicación web desarrollada para la asignatura de **Ingeniería Web**. Permite redactar publicaciones, validar los datos ingresados, enviarlos a una API REST mediante JavaScript asíncrono (`fetch` con el método `POST`) y actualizar dinámicamente la interfaz utilizando el DOM.

El proyecto utiliza tecnologías web nativas: HTML5, CSS3 y JavaScript vanilla, sin frameworks ni dependencias externas.

## 🎨 Diseño e interfaz

La aplicación presenta un diseño moderno inspirado en el *Glassmorphism* y el *Liquid Glass*, con superficies translúcidas, bordes sutiles, controles redondeados y transiciones suaves.

### Características principales

- **Diseño responsive:** adaptable a dispositivos móviles, tabletas y computadoras.
- **Validación de datos:** evita enviar publicaciones con campos vacíos o compuestos únicamente por espacios.
- **Consumo de API REST:** envía publicaciones mediante solicitudes HTTP `POST`.
- **Actualización dinámica del DOM:** muestra los resultados sin recargar la página.
- **Control de envíos:** evita solicitudes duplicadas mientras se procesa una publicación.
- **Manejo de errores:** contempla fallos de conexión, respuestas HTTP no satisfactorias y errores de procesamiento.
- **Seguridad:** utiliza `textContent` para mostrar datos externos y reducir el riesgo de vulnerabilidades XSS.
- **Accesibilidad:** contempla la navegación por teclado y la preferencia por movimiento reducido.

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- Fetch API
- JSONPlaceholder como API de prueba

## 🚀 Instalación y ejecución

### Opción 1. Apertura directa

1. Descarga o clona el repositorio.
2. Abre el archivo `index.html` en un navegador moderno.
3. Introduce el título y el contenido de una publicación.
4. Pulsa el botón **Publicar mensaje**.

Se requiere conexión a Internet para comunicarse con la API. Si las solicitudes no funcionan al abrir el archivo directamente, utiliza la segunda opción.

### Opción 2. Servidor HTTP local

**Requisito:** tener Python 3 instalado.

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
python -m http.server 8000
```

Después, accede desde el navegador a:

http://localhost:8000

Para detener el servidor, presiona `Ctrl + C` en la terminal.

## 📁 Estructura del proyecto

```text
publicador-mensajes/
├── index.html    # Estructura de la página y formulario
├── estilos.css   # Diseño visual y estilos responsive
├── app.js        # Validación, solicitudes HTTP y manipulación del DOM
└── README.md     # Documentación del proyecto
```

## ⚙️ Funcionamiento técnico

### 1. Gestión de eventos

El formulario utiliza `addEventListener("submit", enviarPublicacion)` para detectar los envíos. La instrucción `event.preventDefault()` evita la recarga de la página.

### 2. Validación de datos

Los valores ingresados se procesan mediante `trim()` para eliminar espacios en blanco al inicio y al final. La función `validarPublicacion()` comprueba que los campos obligatorios contengan información válida antes de enviar la solicitud.

### 3. Solicitud HTTP

La aplicación utiliza `fetch()` con el método `POST` para enviar los datos en formato JSON mediante `JSON.stringify()`, junto con el encabezado `Content-Type: application/json`.

### 4. Programación asíncrona

Se utilizan `async/await` para esperar la respuesta de la API sin bloquear el hilo principal del navegador.

### 5. Verificación de la respuesta

La propiedad `response.ok` permite comprobar si la respuesta HTTP fue satisfactoria. Asimismo, se pueden validar los campos esperados de la publicación antes de actualizar la interfaz.

### 6. Manipulación del DOM y seguridad

La interfaz se actualiza dinámicamente mediante JavaScript. Para mostrar contenido externo, se utiliza `textContent` en lugar de insertar directamente datos no confiables con `innerHTML`.

### 7. Manejo de errores

El uso de `try/catch/finally` permite gestionar errores durante la solicitud y restablecer el estado de la interfaz después de finalizar el proceso.

Si está implementado en `app.js`, `AbortController` permite cancelar solicitudes que superen el tiempo límite establecido.

## 📝 Consideraciones sobre la persistencia

El proyecto utiliza **JSONPlaceholder**, una API pública destinada a pruebas y demostraciones.

Aunque la API puede devolver una respuesta satisfactoria y un identificador para una publicación, los datos creados no se almacenan permanentemente como en una aplicación con backend propio.

Para conservar las publicaciones de manera persistente, sería necesario implementar un backend y conectarlo a una base de datos.

## 🔗 Información del proyecto

- **Repositorio:** https://github.com/Marcelo-CC/publicador-mensajes-fetch
- **Asignatura:** Ingeniería Web.
- **Modalidad:** trabajo práctico colaborativo.
- **Tipo de aplicación:** aplicación web cliente integrada con una API REST.

## 🎯 Objetivo académico

Aplicar los fundamentos del desarrollo web mediante una aplicación que integre formularios, validación de datos, programación asíncrona, consumo de una API REST, manipulación del DOM y manejo de errores.