




function obtenerProductos() {
    
 fetch("./productos.json")
        .then(resp => resp.json())
        .then(info => principal(info))
        .catch(error => console.log("Erron en el sistema, error: " + error))
   
} 

obtenerProductos()




function principal(productos) {

  articulosTienda(productos)
  carritoSeccion()
  

  let inputNombre = document.getElementById("inputNombre")
  let inputCategoria = document.getElementById("inputCategoria")

  let botonBuscar = document.getElementById("botonBuscar")
  botonBuscar.addEventListener("click", () => filtrarProducto(inputNombre, inputCategoria, productos))

  let botonComprar = document.getElementById("comprar")
  botonComprar.addEventListener("click", finalizarCompra)
  
}

function articulosTienda(productos) {
  
  let  contenedor = document.getElementById("productos")
  contenedor.innerHTML = ""
  productos.forEach(({ rutaImg, nombre, precio, stock, id }) => {
    let tarjetaprod = document.createElement("div")
    tarjetaprod.className = "producto"
    tarjetaprod.innerHTML = `
    <img src="./imagenes/${rutaImg}" />
    <h2>${nombre}</h2>
    <h4>${precio}</h4>
    <h5>${stock}</h5>
    <button id= ${id}>Agregar al carrito</button> `

    contenedor.appendChild(tarjetaprod)

    let botonAgregarAlCarrito = document.getElementById(id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarAlCarrito(e, productos))

    
    

    
  })
  
}

function filtrarProducto(inputNombre, inputCategoria, productos) {
  


  let productoFiltrado  
  if (inputNombre.value && (!inputCategoria.value)) {
    productoFiltrado = productos.filter(producto => producto.nombre.includes(inputNombre.value))
    
  } else if ((!inputNombre.value) && inputCategoria.value) {
    productoFiltrado = productos.filter(producto => producto.categoria.includes(inputCategoria.value))
  

  } else if (inputNombre.value && inputCategoria.value) {
    productoFiltrado = productos.filter(producto => producto.nombre.includes(inputNombre.value) && producto.categoria.includes(inputCategoria.value))
    
  }
  
  articulosTienda(productoFiltrado)
  
  
}

function obtenerCarrito() {
  let carrito = []

  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    
  }
  return carrito
  
}

function agregarAlCarrito(e, productos) {
  let carrito = obtenerCarrito()
  

  let idBotonProducto = Number(e.target.id)
  let productoAgregado = productos.find (({id}) => id === idBotonProducto)
  let   {id, nombre, precio, stock} = productoAgregado
  let productoEnCarrito = carrito.find(({id}) => id === idBotonProducto)

  if (stock > 0) {
    productoAgregado.stock--
    if (productoEnCarrito) {
      productoEnCarrito.unidades++
      productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.unidades
      
    } else {
      carrito.push({
        id: id,
        nombre: nombre,
        precio: precio,
        unidades: 1,
        subtotal: precio

         
  })
}
      localStorage.setItem("carrito", JSON.stringify(carrito))
      carritoSeccion()
    }
  
      
       Toastify({

        text: "Producto agregado",
        duration: 2000
        }).showToast()
    
  
  
}

function carritoSeccion() {
  let carrito = obtenerCarrito()

  let contenedor = document.getElementById("carrito")
  contenedor.innerHTML = ""
  

  carrito.forEach(({nombre, precio, unidades, subtotal}) => {
    let item = document.createElement("tr")
    item.innerText = nombre + " " + precio + " " + unidades + " " + subtotal
    item.innerHTML = `
    <td>${nombre}</td>
    <td>${precio}</td>
    <td>${unidades}</td>
    <td>${subtotal}</td>
    `

    contenedor.append(item)
  })
      calcularTotal()
  
}

function finalizarCompra() {
  alertas("Muchas gracias por su compra", "Su pago se realizo con exito", "success", 3000)
  localStorage.removeItem("carrito")
  carritoSeccion()
  
  
}

function calcularTotal() {
  let carrito = obtenerCarrito()
  let totalCompra = document.getElementById("montoTotal")
  totalCompra.innerText = carrito ? carrito.reduce((acum, producto) => acum + producto.subtotal, 0 ): 0
  
}

 function alertas(title, text, icon, timer) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: false
  
  
  })
  
} 

