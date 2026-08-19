document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
    const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

let contenidoLista ='';

db.collection("platillo").onSnapshot((datos) => {
  datos.docChanges().forEach((registro) => {
    if (registro.type === "added"){
      agregarALista(registro.doc.data(),registro.doc.id);
    } 
  });
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);

})

function agregarALista(platillo, id){
contenidoLista += `<option value='${id}'>

${platillo.nombre} </option>`;
document.getElementById('listaPlatillos').innerHTML=contenidoLista;
}
M.AutoInit();




btnGuardarPedido = document.getElementById('btnGuardarPedido');
let contenido ="";

btnGuardarPedido.addEventListener('click', function() {

  const selectPlatillos = document.getElementById('listaPlatillos');
  const inputDireccion = document.getElementById('Direccion');
  const inputUsuario = document.getElementById('nombre');


  const platilloId = selectPlatillos.value;
  const platilloNombre = selectPlatillos.options[selectPlatillos.selectedIndex].text;
  const usuarionombre = inputUsuario.value.trim();
  const direccion = inputDireccion.value.trim();


  if (!platilloId || !direccion) {
    alert('Selecciona las opciones paro');
    return;
  }

  const pedidoNuevo = {
    platilloId: platilloId,
    usuario: usuarionombre,
    platilloNombre:  platilloNombre,
    dirrecion: direccion
  };

  db.collection("pedidos").add(pedidoNuevo)
    .then((docRef) => {
      alert('Pedido agregado con ID: ' + docRef.id);

      // Limpiar contenedor QR antes de generar uno nuevo
      document.getElementById("qr").innerHTML = "";

      // Generar QR con el nombre del platillo pedido
      new QRCode(document.getElementById("qr"), {
        text: platilloNombre,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      selectPlatillos.value = "";
      inputDireccion.value = "";
      inputUsuario.value= "";
    })
    .catch((error) => {
      console.log(error);
      alert('error al agregar pedido');
    });
});


const btnCanselar = document.getElementById('btnCanselar');

btnCanselar.addEventListener('click', function() {
    window.location.href = "../index.html";
});


document.getElementById('btnUbicacion').addEventListener('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(exito, error); 
      
    ;
  }
});


function exito(posicion) {
  let latitud = posicion.coords.latitude;
  let longitud = posicion.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&format=json `, {
    headers: {
      'User-Agent': 'UIEast/ (santiagogoku443@gmail.com)'
    }
  })
  .then(respuesta => respuesta.json())
  .then(data =>{
      let ciudad = data.address.city;
      let pais = data.address.country;
  document.getElementById("Direccion").value = `${ciudad}, ${pais}`;

  var map = L.map('mapa').setView([latitud, longitud],13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, 
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var marker = L.marker([latitud, longitud]).addTo(map);
  })
  .catch(error =>  console.error(error));
}
function error() {
  M.toast({html: 'No se pudo obtener la ubicación'});
}