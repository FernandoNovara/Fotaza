var preview = (event)=>{
    var imagen = document.getElementById('image-create')
    var resolucion = document.getElementById('resolucion')
    var altoOriginal = imagen.naturalHeight
    var anchoOriginal = imagen.naturalWidth

    resolucion.value = anchoOriginal + "x" + altoOriginal

    var file_image = new FileReader()
    var preview_img = document.getElementById('image-create')

    file_image.onload = ()=>{
        if(file_image.readyState == 2){
            preview_img.src = file_image.result
        }
    }

    file_image.readAsDataURL(event.target.files[0])
}

function cambiarEstado()
{
    const estado = document.getElementById("Estado").value

    if(estado == "Protegido")
    {
        document.forms['formulario'].action = "/Publicar/Private"
        document.getElementById("Derecho_Uso").options.item(0).selected = "selected"
    }
    else
    {
        document.forms['formulario'].action = "/Publicar/Publico"
        document.getElementById("Derecho_Uso").options.item(1).selected = "selected"
    }
}

function cambiarDerecho()
{
    const derecho = document.getElementById("Derecho_Uso").value

    if(derecho == "Copyright")
    {
        document.forms['formulario'].action = "/Publicar/Private"
        document.getElementById("Estado").options.item(0).selected = "selected"
    }
    else
    {
        document.forms['formulario'].action = "/Publicar/Publico"
        document.getElementById("Estado").options.item(1).selected = "selected"
    }
}

function calificar(item)
{
    const valoracion = document.getElementById("valoracion")
    for(let i=1; i <= 5; i++)
    {
        document.getElementById(i+"").style.color = "white"
    }
    
    for(let i=1; i <= item.id; i++)
    {
        document.getElementById(i+"").style.color = "orange"
    }
    valoracion.value = item.id
    
}

function cargarEtiquetas()
{
    const etiqueta = document.getElementById("etiqueta").value
    const listaEtiqueta = document.getElementById("etiquetas")

    const cadena = listaEtiqueta.value.split(" ")
    console.log(cadena.count)
    if(cadena.count < 4 || cadena.count == undefined)
        listaEtiqueta.value = listaEtiqueta.value + etiqueta + " "
    else
        alert("no se puede agregar mas etiquetas")

    document.getElementById("etiqueta").value = ""
}