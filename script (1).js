// Definición de variables
var currentPage = 1; // Página actual
var cardsPerPage = 12; // Cantidad de tarjetas por página
var totalPages = 0; // Total de páginas disponibles

// Función para mostrar la sección de personajes
function ver_personajes() {
  document.getElementById('Card-principal').style.display = "block"; // Mostrar la sección principal de tarjetas
  document.getElementById('pantalla-inicial').style.display = "none"; // Ocultar la pantalla inicial
  document.getElementById('pantalla-inferior').style.display = "none"; // Ocultar la pantalla inicial 
}

// Función para obtener los datos de los personajes
function getData() {
  $.ajax({
    type: 'GET',
    url: "https://apisimpsons.fly.dev/api/personajes?limit=200", // URL de la API 
    dataType: "json",
    async: false,
    success: function(data) {
      var personajes = data.docs; // Obtiene la lista de personajes
      totalPages = Math.ceil(personajes.length / cardsPerPage); // Calcula el total de páginas necesarias para mostrar todos los personajes

      for (let index = 0; index < personajes.length; index++) {
        var personaje = personajes[index]; // Obtiene el personaje actual del bucle
        console.log(personaje.Imagen); // Imprime la URL de la imagen del personaje en la consola

        let div = $("<div></div>"); // Crea un elemento <div> utilizando jQuery
        div.addClass("personaje-card"); // Agrega la clase CSS "personaje-card" al elemento <div>

        let img = $("<img></img>"); // Crea un elemento <img> utilizando jQuery
        img.attr("src", personaje.Imagen); // Establece la URL de la imagen del personaje como atributo "src" del elemento <img>
        img.addClass("card-img"); // Agrega la clase CSS "card-img" al elemento <img>
        div.append(img); // Agrega el elemento <img> al elemento <div>

        let name = $("<h3></h3>"); // Crea un elemento <h3> utilizando jQuery
        name.addClass("card-title"); // Agrega la clase CSS "card-title" al elemento <h3>
        name.append(personaje.Nombre); // Agrega el nombre del personaje al elemento <h3>
        div.append(name); // Agrega el elemento <h3> al elemento <div>

        let estado = $("<h4></h4>"); // Crea un elemento <h4> utilizando jQuery
        estado.addClass("card-estado"); // Agrega la clase CSS "card-estado" al elemento <h4>
        estado.append("Estado- " + personaje.Estado); // Agrega el estado del personaje al elemento <h4>
        div.append(estado); // Agrega el elemento <h4> al elemento <div>

        let genero = $("<h6></h6>"); // Crea un elemento <h6> utilizando jQuery
        genero.addClass("card-genero"); // Agrega la clase CSS "card-genero" al elemento <h6>
        genero.append("Genero- " + personaje.Genero); // Agrega el género del personaje al elemento <h6>
        div.append(genero); // Agrega el elemento <h6> al elemento <div>

        let ocupacion = $("<h8></h8>"); // Crea un elemento <h8> utilizando jQuery
        ocupacion.addClass("card-ocupacion"); // Agrega la clase CSS "card-ocupacion" al elemento <h8>
        ocupacion.append("Ocupacion- " + personaje.Ocupacion); // Agrega la ocupación del personaje al elemento <h8>
        div.append(ocupacion); // Agrega el elemento <h8> al elemento <div>

        let button = $("<button></button>"); // Crea un elemento <button> utilizando jQuery
        button.text("Dato Importante!"); // Establece el texto del botón como "Dato Importante!"
        button.addClass("card-button"); // Agrega la clase CSS "card-button" al elemento <button>
        button.data("historia", personaje.Historia); // Establece el atributo de datos "historia" del botón con la historia del personaje
        div.append(button); // Agrega el elemento <button> al elemento <div>

        $(".container-cards").append(div); // Agrega el elemento <div> al contenedor de tarjetas en el documento HTML
      }

      // Asigna un evento de clic a todos los botones con clase "card-button"
      $(".card-button").on("click", function() {
        var historia = $(this).data("historia"); // Obtiene la historia del personaje del atributo de datos "historia" del botón
        Swal.fire({ // Muestra una ventana emergente utilizando la librería SweetAlert
          title: 'Historia',
          text: historia, // Establece el texto de la ventana emergente como la historia del personaje
          icon: 'info',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'my-custom-alert',
          }
        });
      });

      // Mostrar la página inicial al cargar la página
      showPage(currentPage);
    },
  });
}

// Ejecuta la función getData() cuando el documento HTML ha sido completamente cargado
$(document).ready(function() {
  getData();
});

// Asigna un evento de clic a todas las imágenes con clase "card-img"
$(document).ready(function() {
  $(".card-img").click(function() {
    $(this).toggleClass("expanded"); // Alterna la clase CSS "expanded" en la imagen cuando se hace clic en ella
  });
});

// Asigna un evento de clic al botón con id "search-button"
$(document).ready(function() {
  var personajes = $(".personaje-card");

  $("#search-button").click(function() {
    var searchTerm = $("#search-input").val().toLowerCase(); // Obtiene el término de búsqueda ingresado por el usuario y lo convierte a minúsculas
    var resultados = personajes.filter(function() {
      var nombrePersonaje = $(this).find(".card-title").text().toLowerCase(); // Obtiene el nombre del personaje en cada tarjeta y lo convierte a minúsculas
      return nombrePersonaje.includes(searchTerm); // Comprueba si el término de búsqueda se encuentra en el nombre del personaje
    });

    personajes.hide(); // Oculta todas las tarjetas de personajes

    if (resultados.length > 0) {
      resultados.show(); // Muestra las tarjetas de personajes que coinciden con el término de búsqueda
    } else {
      $(".no-results").show(); // Muestra un mensaje de "Sin resultados" si no se encontraron coincidencias
    }
  });
});

// Función para mostrar una página específica de tarjetas
function showPage(page) {
  currentPage = page;

  $(".personaje-card").hide(); // Oculta todas las tarjetas de personajes

  var startIndex = (currentPage - 1) * cardsPerPage; // Índice de inicio de la página actual
  var endIndex = startIndex + cardsPerPage; // Índice de fin de la página actual

  var personajes = $(".personaje-card");
  var pagePersonajes = personajes.slice(startIndex, endIndex); // Obtiene las tarjetas de personajes para la página actual

  pagePersonajes.show(); // Muestra las tarjetas de personajes para la página actual

  // Actualiza los botones de paginación
  $(".pagination-button").removeClass("active");
  $("#pagination-button-" + currentPage).addClass("active");
}

// Función para navegar a la página anterior
function previousPage() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}

// Función para navegar a la página siguiente
function nextPage() {
  if (currentPage < totalPages) {
    showPage(currentPage + 1);
  }
}

// Genera los botones de paginación
function generatePaginationButtons() {
  var pagination = $(".pagination");

  for (let i = 1; i <= totalPages; i++) {
    var button = $("<button></button>"); // Crea un elemento <button> utilizando jQuery
    button.text(i); // Establece el texto del botón como el número de página
    button.addClass("pagination-button"); // Agrega la clase CSS "pagination-button" al elemento <button>
    button.attr("id", "pagination-button-" + i); // Establece el atributo "id" del botón con el número de página
    button.click(function() {
      showPage(i); // Asigna un evento de clic para mostrar la página correspondiente al número de página
    });

    pagination.append(button); // Agrega el botón de paginación al elemento de paginación en el documento HTML
  }
}

// Genera los botones de paginación al cargar la página
$(document).ready(function() {
  generatePaginationButtons();
});

// Función para mostrar las secciónes del header
document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a los enlaces del menú
  var inicioLink = document.querySelector('a[href="#inicio"]');
  var personajesLink = document.querySelector('a[href="#personajes"]');
  var contactoLink = document.querySelector('a[href="#contacto"]');

  // Obtener referencias a las secciones
  var pantallaInicialSection = document.getElementById('pantalla-inicial');
  var personajesSection = document.getElementById('Card-principal');
  var contactoSection = document.getElementById('pantalla-inferior');

  // Agregar eventos de clic a los enlaces del menú
  inicioLink.addEventListener('click', mostrarPantallaInicial);
  personajesLink.addEventListener('click', mostrarPersonajes);
  contactoLink.addEventListener('click', mostrarContacto);

  function mostrarPantallaInicial(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

    // Mostrar la sección de la pantalla inicial y ocultar las otras secciones
    pantallaInicialSection.style.display = 'block';
    personajesSection.style.display = 'none';
    contactoSection.style.display = 'none';
  }

  function mostrarPersonajes(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

    // Mostrar la sección de personajes y ocultar las otras secciones
    pantallaInicialSection.style.display = 'none';
    personajesSection.style.display = 'block';
    contactoSection.style.display = 'none';
  }

  function mostrarContacto(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

    // Mostrar la sección de contacto y ocultar las otras secciones
    pantallaInicialSection.style.display = 'none';
    personajesSection.style.display = 'none';
    contactoSection.style.display = 'block';
  }
});

