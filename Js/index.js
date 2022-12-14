// == selectores ==

const productosContainer = document.querySelector('#contenedor-productos')
const carritoContenedor = document.querySelector('#carrito-contenedor')

const contadorCarrito = document.querySelector('#contadorCarrito')
const precioTotal = document.querySelector('#precioTotal')

const btnVaciar = document.getElementById('vaciarCarrito')


const carrito = JSON.parse(localStorage.getItem('carrito')) || []

// generar el DOM de todos los productos
stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')

    div.innerHTML = `
                    <img src=${producto.img} alt="">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.desc}</p>
                    <p>${producto.tipo}</p>
                    ${producto.freeshipping === true ? '<p><strong>Envío gratis</strong></p>' : ''}
                    <p class="precioProducto">Precio: $${producto.precio}</p>
                    <button onclick="agregarAlCarrito(${producto.id})" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
                `

    productosContainer.append(div)
})


// function agregarAlCarrito() {

// }

const agregarAlCarrito = (productId) => {
    // const item = stockProductos.find( (producto) => producto.id === productId)
    // const {id, nombre, precio} = item
    const itemInCart = carrito.find((producto) => producto.id === productId)

    if (itemInCart) {
        itemInCart.cantidad += 1
        showMensaje(itemInCart.nombre)
    } else {
        const {id, nombre, precio} = stockProductos.find( (producto) => producto.id === productId)
    
        const itemToCart = {
            id, 
            nombre, 
            precio, 
            cantidad: 1
        }
        carrito.push(itemToCart)
        showMensaje(nombre)
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))

    console.log(carrito)
    renderCarrito()
    renderCantidad()
    renderTotal()
}

const removerDelCarrito = (id) => {
    const item = carrito.find((producto) => producto.id === id)

    item.cantidad -= 1
    // item.cantidad--

    if (item.cantidad === 0) {
        const indice = carrito.indexOf(item)
        carrito.splice(indice, 1)
    }

    Toastify({
        text: `Se eliminó 1 unidad de ${item.nombre}`,
        position: 'left',
        gravity: 'bottom',
        duration: 5000,
        style: {
            background: "linear-gradient(to right, #f17b5d, #f02f2f)",
          }
    }).showToast()

    localStorage.setItem('carrito', JSON.stringify(carrito))

    renderCarrito()
    renderCantidad()
    renderTotal()
}

const vaciarCarrito = () => {
    carrito.length = 0
    localStorage.setItem('carrito', JSON.stringify(carrito))

    renderCarrito()
    renderCantidad()
    renderTotal()
}


btnVaciar.addEventListener('click', () => {
    Swal.fire({
        title: 'Está seguro?',
        text: "Está a punto de cancelar el alquiler de los equipos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí! , me arrepenti',
        cancelButtonText: 'No!, me confundi'
      }).then( (result) => {
            if (result.isConfirmed) {
                vaciarCarrito()
                botonCerrar.click()
                Toastify({
                    text: 'Se vació el carrito',
                    position: 'left',
                    gravity: 'bottom',
                    duration: 5000,
                    style: {
                        background: "linear-gradient(to right, #f17b5d, #f02f2f)",
                      }
                }).showToast()
            }
      } )
})

const renderCarrito = () => {
    carritoContenedor.innerHTML = ''

    carrito.forEach((item) => {
        const div = document.createElement('div')
        div.classList.add('productoEnCarrito')

        div.innerHTML = `
                    <p>${item.nombre}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>Precio unitario: $${item.precio}</p>
                    <button onclick="removerDelCarrito(${item.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                    `
        
        carritoContenedor.append(div)
    })
}

const renderCantidad = () => {
    contadorCarrito.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad, 0)
}

const renderTotal = () => {
    let total = 0
    carrito.forEach((producto) => {
        total += producto.precio * producto.cantidad
    })

    precioTotal.innerText = total
}

const showMensaje = (nombre) => {
    Toastify({
        text: `Se agregó 1 unidad de ${nombre} al carrito!`,
        duration: 3000,
        gravity: 'bottom',
        position: 'left',
        onClick: () => {
            botonAbrir.click()
        },
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast()
}

renderCarrito()
renderCantidad()
renderTotal()

/* Audio Icon */



let audio = document.getElementById('audioShop');
audio.volume = 0.1;

let audioIcon = document.getElementById('audioIcon');
audioIcon.innerHTML= `
    <img id="audio" src="./img/icons8-volumen-alto-30.png"/>
`;

let toggle = false;
function changeAudioIcon() {
    if (toggle === true) {
        document.getElementById('audio').src  = './img/icons8-volumen-alto-30.png'; 
    } else {
       document.getElementById('audio').src = './img/icons8-mudo-30.png';
    }
    toggle = !toggle; 
}

//Mute

function toggleMute() {
    let myAudio = document.getElementById('audioShop');
    myAudio.muted = !myAudio.muted;
 }

audioIcon.addEventListener("click", () => {
    toggleMute();
    changeAudioIcon();
});

/**************************************************************/
/*                        CONTACTO                            */
/**************************************************************/
function sendMailContacto (form) {  // Manda el mail al dueño de la página con la información de la persona
    let nombre = form.querySelector("#nombre--contacto").value.toUpperCase();
    let boton = form.querySelector(".boton--contacto");
    
    boton.innerText = 'Enviando...';

    const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,   
        timer: 5000,
        position: "top-end",
        color: "#645899"
    });
    
    emailjs.init('9oAkw-6MONbCSxNDH');
    const serviceID = "service_hopw67s";
    const templateID = "template_wyd82p8";

    emailjs.send(serviceID, templateID, {
        name: form.querySelector("#nombre--contacto").value,
        email: form.querySelector("#email--contacto").value,
        phone: form.querySelector("#telefono--contacto").value,
        message: form.querySelector("#mensaje--contacto").value,
    })
    .then(() => {
        Toast.fire({
            icon: 'success',
            title: `${nombre}! Vamos a estar comunicandonos con vos lo antes posible!`,
        })
        boton.innerText  = 'Enviar';
    }).catch(error => {
        Toast.fire({
            icon: 'error',
            title: "Hubo un error. Espera un rato e intenta nuevamente."
        });
        console.log(error);
        boton.innerText  = 'Enviar';
    });
}

if (thisURL.includes("contacto.html")){
    let formContacto = document.querySelector(".main--contacto .formContacto");
    formContacto.addEventListener("submit", (e) => {
        e.preventDefault();
        let email = e.target.querySelector("#email--contacto").value;
        
        if (validarEmail(email)){
            sendMailContacto(e.target);
        } else {
            const Toast = Swal.mixin({
                toast: true,
                showConfirmButton: false,   
                timer: 5000,
                position: "top-end",
                color: "#645899"
            }).fire({
                icon: 'error',
                title: 'Vamos a necesitar un email válido para poder comunicarnos con vos!'
            });
        }
    })
}