// Nombre fichero: controladorTablaMedidas
// Fecha: 25/11/2021
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador se encarga de ejecutar las funciones de la logica necesarias para la aplicación

// Identificamos los elementos en la pagina html
const COContainer = document.getElementById("CO_container");
const CO2Container = document.getElementById("CO2_container");
const O3Container = document.getElementById("O3_container");
const TemperaturaContainer = document.getElementById("Temperatura_container");

const tabla = document.getElementById("contenedorTabla");

// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
  
  // Hasta que recibamos datos se muestra este texto
  let text = "Recopilando datos";

  COContainer.innerHTML =  `<div class="card card-body mt-2 border-primary">${text}</div>`;
  CO2Container.innerHTML =  `<div class="card card-body mt-2 border-primary">${text}</div>`;
  O3Container.innerHTML =  `<div class="card card-body mt-2 border-primary">${text}</div>`;
  TemperaturaContainer.innerHTML = `<div class="card card-body mt-2 border-primary">${text}</div>`;
  
  // onGetMediciones solo esta para mostrar la funcionalidad
  onGetMediciones((querySnapshot) => {

    // Nos aseguramos de que la tabla este vacia
    tabla.innerHTML = "";
    // Insertamos
    querySnapshot.forEach((doc) => {
      insertarEnLaTabla(doc)
    });
    
    // Inserta las mediciones en los containers correspondientes
    recibirMedicionesEInsertarlas(COContainer, CO2Container, O3Container, TemperaturaContainer);
  });
});