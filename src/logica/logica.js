// Nombre fichero: logica
// Fecha: 25/11/2021
// Autor: Jorge Grau Giannakakis
// Descripción: Este programa contiene la logica de la aplicacion

// Inicializamos la base de datos
const database = firebase.firestore();

// Creamos los arrays para las medias
var array_CO = [];
var array_CO2 = [];
var array_O3 = [];
var array_Temperatura = [];

// Tiene todas las mediciones
const getMediciones = () => database.collection("mediciones").get();

// Cuando se añade un dato en Firebase se llama a esta función
const onGetMediciones = (callback) => database.collection("mediciones").onSnapshot(callback);

/**
 * Dado un documento de Firebase añade una columna a la tabla
 * doc: FirestoreDocument -> insertarEnLaTabla -> 
 * @param {FirestoreDocument} doc Documento de Firestore, contiene todos los datos.
 */
 async function insertarEnLaTabla(doc){
    
    const medida = doc.data();
    let fecha = new Date(medida.fecha);

    tabla.innerHTML += `
      <tr>
      <td class="text" id="valorMediciones">${medida.valor}</td>
      <td class="text" id="valorTipo">${medida.tipo}</td>
      <td class="text" id="valorFecha">${fecha}</td>
      </tr>`;
}

/**
 * Recibe los datos, calcula la media y los inserta en los containers epecificados
 * COContainer: htmlContainer, CO2Container: htmlContainer, O3Container: htmlContainer, TemperaturaContainer: htmlContainer -> recibirMedicionesEInsertarlas -> 
 * @param {htmlContainer} COContainer Container donde va el CO
 * @param {htmlContainer} CO2Container Container donde va el CO2
 * @param {htmlContainer} O3Container Container donde va el O3
 * @param {htmlContainer} TemperaturaContainer Container donde va la Temperatura
 */
async function recibirMedicionesEInsertarlas(COContainer, CO2Container, O3Container, TemperaturaContainer){
    
    const timestamp = (new Date().getTime());
    const haceUnaHora = timestamp - 3600000;

    database.collection('mediciones').where('fecha', '>=', haceUnaHora).where('fecha', '<=', timestamp).get().then(snapshot => {              
        
        snapshot.forEach(doc => {

            let mediciones = doc.data();
            
            if(mediciones.tipo == "CO"){
                insertarEnSuArray(mediciones, array_CO);              
            }
            else if(mediciones.tipo == "CO2"){
                insertarEnSuArray(mediciones, array_CO2);               
            }
            else if(mediciones.tipo == "O3"){
                insertarEnSuArray(mediciones, array_O3);                 
            }
            else if(mediciones.tipo == "Temperatura"){
                insertarEnSuArray(mediciones, array_Temperatura);                  
            }
        })
        insertarMedia(COContainer, array_CO);
        insertarMedia(CO2Container, array_CO2);
        insertarMedia(O3Container, array_O3);
        insertarMedia(TemperaturaContainer, array_Temperatura);
        return;
    }).catch( error => {});
}

/**
 * Inserta los valores en un array que se usara posteriormente para calcular la media
 * mediciones: Medicion, array: double[] -> insertarEnSuArray -> 
 * @param {Medicion} mediciones Objeto con todos los datos de la base de datos.
 * @param {double[]} array El array con los valores de las medias
 */
function insertarEnSuArray(mediciones, array){
    array.push(mediciones.valor);
}

/**
 * Calcula la media dado un array
 * array: double[] -> calcularMedia -> 
 * @param {double[]} array El array con los valores de las medias
 */
 function calcularMedia(array){
    var media = 0;
    for(let i = 0; i < array.length; i++){
        media += array[i];
    }

    return media;
}

/**
 * Inserta la media calculada en el container especificado
 * container: htmlContainer, array: double[] -> insertarMedia ->
 * @param {double[]} array El array con los valores de las medias
 * @param {htmlContainer} Container Container especificado
 */
function insertarMedia(container, array){
    // Texto por si no hay datos
    let text = "No hay datos ahora mismo, espera a que sensor los reciba";

    let media = calcularMedia(array);

    if(media != 0){ 
        console.log("Entra");
        media = media/array.length;
        container.innerHTML = "";
        container.innerHTML += `<div class="card card-body mt-2 border-primary">${media} </div>`;
    }else{
        container.innerHTML = `<div class="card card-body mt-2 border-primary">${text}</div>`;
    }
}
