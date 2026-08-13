const btnAgregarPlatillo = document.getElementById('btnAgregarPlatillo');

let contenido = "";



document.addEventListener('DOMContentLoaded', function() {

  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });

  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });

});



btnAgregarPlatillo.addEventListener('click', function() {

  alert('Platillo agregado');

});



function mostrarPlatillo(platillo, id) {

  let fotoPlatillo;

  if (platillo.foto) {

    fotoPlatillo = "data:image/png;base64," + platillo.foto;

  } else {

    fotoPlatillo = "img/icons/icon-192x192.png";

  }

  contenido +=
  `<div class="card-panel recipe white row" id="${id}">

    <img 
      src="${fotoPlatillo}" 
      height="100px" 
      width="100px"
    >

    <div class="recipe-details">

      <div class="recipe-title">
        Nombre: ${platillo.nombre}
      </div>

      <div class="recipe-ingredients">
        Ingredientes: ${platillo.ingredientes}
      </div>

      <div class="recipe-price">
        Precio: $${platillo.precio}
      </div>

    </div>

    <div class="recipe-delete">

      <i 
        class="material-icons" 
        data-id="${id}">
        delete_outline
      </i>

    </div>

  </div>`;

  document.querySelector('.recipes').innerHTML = contenido;

}



function actualizarPlatillo(platillo, id) {

  let tarjeta = document.getElementById(`${id}`);

  if (!tarjeta) return;


  tarjeta.querySelector(".recipe-title").innerHTML =
    "Nombre: " + platillo.nombre;


  tarjeta.querySelector(".recipe-ingredients").innerHTML =
    "Ingredientes: " + platillo.ingredientes;


  tarjeta.querySelector(".recipe-price").innerHTML =
    "Precio: $" + platillo.precio;


  if (platillo.foto) {

    tarjeta.querySelector("img").src =
      "data:image/png;base64," + platillo.foto;

  }

}



document.querySelector('.recipes').addEventListener('click', function(e) {

  const icono =
    e.target.closest('.recipe-delete .material-icons');

  if (!icono) return;


  const id = icono.dataset.id;



  db.collection("platillos").doc(id).delete()

    .then(() => {

      const tarjeta = document.getElementById(id);

      if (tarjeta) {
        tarjeta.remove();
      }

      alert('Platillo eliminado');

    })

    .catch((error) => {

      console.log(error);

      alert('Error al eliminar el platillo');

    });

});



let streaming = false;

const width = 320;

let height = 0;


const video = document.getElementById('video');

const canvas = document.getElementById('canvas');

const foto = document.getElementById('foto');

const btnFoto = document.getElementById('btnFoto');

const btntomarFoto = document.getElementById('tomarFoto');



btnFoto.addEventListener("click", function(e) {

  e.preventDefault();


  navigator.mediaDevices

    .getUserMedia({

      video: {

        facingMode: {
          ideal: "environment"
        }

      },

      audio: false

    })

    .then((stream) => {

      video.srcObject = stream;

      video.play();

    })

    .catch((error) => {

      console.log(error);

    });

});



video.addEventListener("canplay", function() {

  if (!streaming) {

    height =
      video.videoHeight /
      (video.videoWidth / width);


    video.setAttribute("width", width);

    video.setAttribute("height", height);


    streaming = true;

  }

});



function limpiarFoto() {

  const contexto =
    canvas.getContext("2d");


  contexto.fillStyle = "#AAA";


  contexto.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  foto.setAttribute("src", "");

}



function tomarFoto() {

  const contexto =
    canvas.getContext("2d");


  if (width && height) {

    canvas.width = width;

    canvas.height = height;


    contexto.drawImage(
      video,
      0,
      0,
      width,
      height
    );


    const fotoFinal =
      canvas.toDataURL("image/png");


    foto.setAttribute(
      "src",
      fotoFinal
    );


    document.getElementById("foto").value =
      fotoFinal;

  }

  else {

    limpiarFoto();

  }

}



btntomarFoto.addEventListener(
  "click",
  function(e) {

    e.preventDefault();

    tomarFoto();

  }
);