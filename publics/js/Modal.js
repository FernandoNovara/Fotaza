addEventListener("click",openModal,true)

function openModal() {
  var modal_img = document.getElementById("img_modal") //obtengo el input img del modal
  document.querySelectorAll("#myImg") //obtengo todos los elementos con el mismo id
    .forEach(elemento => //los recorro 
    {
      elemento.addEventListener("click",e=> //cada ves que se les haga click obtengo el elemento seleccionado
      {
        modal_img.src  = e.target.getAttribute("src")  //obtengo el atributo src y se lo asigno a input del modal
      })
    })
}


