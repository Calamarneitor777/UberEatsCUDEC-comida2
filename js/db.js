db.collection("platillo").onSnapshot((datos) => {
datos.docChanges().forEach((registro) => {


        if (registro.type === "added"){
            mostrarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro.type ==="modified") {
            actualizarPlatillo (registro.doc.data(),registro.doc.id);
        }
        if (registro.type === "removed") {
            borrarPlatilloDOM(registro.doc.id);
        }
    });
});


const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
        e.preventDefault(); //que el formulario (e) no haga su chamba
        const platilloNuevo = {
            ingredientes: formularioAgregar.ingredients.value,
            nombre: formularioAgregar.title.value,
            precio: formularioAgregar.Precio.value,
            foto: document.getElementById("fotoInput").value
        }

            db.collection("platillo").add(platilloNuevo).catch((error) => {
            console.log(error);
            alert("error al agregar platillo");

        });
            formularioAgregar.ingredients.value ="";
            formularioAgregar.title.value = "";
            formularioAgregar.Precio.value= "";
            document.getElementById("fotoInput").value = "";
            document.getElementById("foto").setAttribute("src", "");
            alert("Platillo agregado");
});