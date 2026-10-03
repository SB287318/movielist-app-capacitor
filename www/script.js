/*Santiago Brito nro 287318*/

class Usuario {
    constructor(usuario, password, idPais) {
        {
            this.usuario = usuario
            this.password = password
            this.idPais = idPais
        }
    }
}

let listaPaises = []
let map = null
let latitud
let longitud
let categorias = []
let peliculas = []
let usuariosPorPais = []

const MENU = document.querySelector("#menu")
const ROUTER = document.querySelector("#ruteo")
const HOME = document.querySelector("#pantalla-home")
const LOGIN = document.querySelector("#pantalla-login")
const REGISTROU = document.querySelector("#pantalla-registroU")
const REGISTROP = document.querySelector("#pantalla-registroP")
const LISTADO = document.querySelector("#pantalla-listado")
const MAPA = document.querySelector("#pantalla-mapa")
const ESTADISTICAS = document.querySelector("#pantalla-estadisticas")
const URLBASE = "https://movielist.develotion.com"

inicio()

function cerrarMenu() {
    MENU.close()
}

function inicio() {
    ocultarMenu()
    previaCargarPaises()
    if (localStorage.getItem("token") == null) {
        mostrarMenuComun()
    } else {
        mostrarMenuVIP()
    }

    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnHacerRegistroU").addEventListener("click", previaRegistrarUsuario)
    document.querySelector("#btnHacerLogin").addEventListener("click", previaHacerLogin)
    document.querySelector("#btnLogout").addEventListener("click", cerrarSesion)
    document.querySelector("#btnRegistroP").addEventListener("click", previaObtenerCategorias)
    document.querySelector("#btnHacerRegistroP").addEventListener("click", previaRegistrarPelicula)
    document.querySelector("#btnListado").addEventListener("click", previaListarPeliculas)
    document.querySelector("#slcFiltroListaP").addEventListener("ionChange", previaListarPeliculas)
    document.querySelector("#btnMapa").addEventListener("click", armarMapa)
    document.querySelector("#btnEstadisticas").addEventListener("click", previaMostrarEstadisticas)
    document.addEventListener('DOMContentLoaded', (event) => { limitarFechaActual(); });
    function limitarFechaActual() {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
        const dia = ('0' + hoy.getDate()).slice(-2);
        const horas = ('0' + hoy.getHours()).slice(-2);
        const minutos = ('0' + hoy.getMinutes()).slice(-2);
        const segundos = ('0' + hoy.getSeconds()).slice(-2);
        const fechaMaxima = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
        document.querySelector('#txtFechaRegistroP').setAttribute('max', fechaMaxima);
    }
    navigator.geolocation.getCurrentPosition(miUbicacion)
}

function previaCargarPaises() {
    fetch("https://movielist.develotion.com/paises")
        .then(function (response) {
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            listaPaises = informacion.paises
            cargarPaises()
        })
        .catch(function (error) {
            console.log(error)
        })
}

function cargarPaises() {
    let miSelect = ""
    console.log(listaPaises)
    for (let unPais of listaPaises) {
        miSelect += `<ion-select-option value="${unPais.id}">${unPais.nombre}</ion-select-option>`
    }
    document.querySelector("#selectPaises").innerHTML = miSelect
}

function navegar(evt) {
    console.log(evt)
    const ruta = evt.detail.to
    ocultarPantallas()
    if (ruta == "/") HOME.style.display = "block"
    if (ruta == "/login") LOGIN.style.display = "block"
    if (ruta == "/registroU") REGISTROU.style.display = "block"
    if (ruta == "/registroP") REGISTROP.style.display = "block"
    if (ruta == "/listado") LISTADO.style.display = "block"
    if (ruta == "/mapa") MAPA.style.display = "block"
    if (ruta == "/estadisticas") ESTADISTICAS.style.display = "block"
}

function ocultarPantallas() {
    HOME.style.display = "none"
    LOGIN.style.display = "none"
    REGISTROU.style.display = "none"
    LISTADO.style.display = "none"
    REGISTROP.style.display = "none"
    MAPA.style.display = "none"
    ESTADISTICAS.style.display = "none"
}

function previaRegistrarUsuario() {
    let usuario = document.querySelector("#txtNombreRegistroU").value
    let password = document.querySelector("#txtPasswordRegistroU").value
    let idPais = Number(document.querySelector("#selectPaises").value)
    let nuevoUsuario = new Usuario(usuario, password, idPais)
    registrarUsuario(nuevoUsuario)
}

function registrarUsuario(nuevoUsuario) {
    fetch(`${URLBASE}/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == 200) {
                mostrarMensaje("SUCCESS", informacion.codigo, "Se registro el usuario con exito", 2000)
                ocultarMenu()
                mostrarMenuVIP()
                localStorage.setItem("token", informacion.token)
                ocultarPantallas()
                HOME.style.display = "block"
            } else {
                mostrarMensaje("ERROR", informacion.codigo, informacion.mensaje, 2000)
            }
            limpiarRegistrarU()
        })
        .catch(function (error) {
            console.log(error)
        })
}

function ocultarMenu() {
    document.querySelector("#btnRegistrarUsuario").style.display = "none"
    document.querySelector("#btnRegistroP").style.display = "none"
    document.querySelector("#btnLogin").style.display = "none"
    document.querySelector("#btnLogout").style.display = "none"
    document.querySelector("#btnListado").style.display = "none"
    document.querySelector("#btnMapa").style.display = "none"
    document.querySelector("#btnEstadisticas").style.display = "none"

}

function mostrarMenuComun() {
    document.querySelector("#btnRegistrarUsuario").style.display = "block"
    document.querySelector("#btnLogin").style.display = "block"
}

function mostrarMenuVIP() {
    document.querySelector("#btnListado").style.display = "block"
    document.querySelector("#btnLogout").style.display = "block"
    document.querySelector("#btnRegistroP").style.display = "block"
    document.querySelector("#btnMapa").style.display = "block"
    document.querySelector("#btnEstadisticas").style.display = "block"
}

function previaHacerLogin() {
    let usuario = document.querySelector("#txtLoginU").value
    let password = document.querySelector("#txtLoginPass").value
    let usuarioLogueado = new Object()
    usuarioLogueado.usuario = usuario
    usuarioLogueado.password = password
    hacerLogin(usuarioLogueado)
}

function hacerLogin(usuarioLogueado) {
    fetch(`${URLBASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioLogueado)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == 200) {
                ocultarPantallas()
                ocultarMenu()
                HOME.style.display = "block"
                mostrarMenuVIP()
                localStorage.setItem("token", informacion.token)
                mostrarMensaje("SUCCESS", informacion.codigo, "Se ingreso con exito", 2000)

            } else {
                mostrarMensaje("ERROR", informacion.codigo, informacion.mensaje, 2000)
            }
            limpiarLogin()
        })
        .catch(function (error) {
            console.log(error)
        })
}

function cerrarSesion() {
    ocultarPantallas()
    HOME.style.display = "block"
    ocultarMenu()
    mostrarMenuComun()
    localStorage.removeItem("usuario")
    localStorage.removeItem("token")
}

function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
        duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

function previaObtenerCategorias() {

    fetch(`https://movielist.develotion.com/categorias `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo != 200) {
                ocultarPantallas()
                ocultarMenu()
                LOGIN.style.display = "block"
                mostrarMenuComun()
                localStorage.removeItem("token")
                mostrarMensaje("ERROR", informacion.codigo, "No se pudo cargar las categorias", 2000)
            } else {
                cargarCategorias(informacion.categorias)
            }

        })
        .catch(function (error) {
            console.log(error)
        })
}


function cargarCategorias(listaCategorias) {
    let miSelect = ""
    for (let unaC of listaCategorias) {
        miSelect += `<ion-select-option value=${unaC.id}> ${unaC.nombre}</ion-select-option>`
    }
    document.querySelector("#slcCategoriaRegistroP").innerHTML = miSelect
}


function previaRegistrarPelicula() {
    let idCategoria = Number(document.querySelector("#slcCategoriaRegistroP").value)
    let nombre = document.querySelector("#txtNombreRegistroP").value
    let fecha = document.querySelector("#txtFechaRegistroP").value
    if (Number.isNaN(idCategoria) || nombre == "") {
        mostrarMensaje("ERROR", "ERROR", "Ingrese categoria y nombre", 2000)
    } else {
        let nuevaPelicula = new Object()
        nuevaPelicula.idCategoria = idCategoria
        nuevaPelicula.nombre = nombre
        nuevaPelicula.fecha = fecha
        previaEvaluarPelicula(nuevaPelicula)
    }
}

function previaEvaluarPelicula(nuevaPelicula) {
    let comentario = document.querySelector("#txtComentarioRegistroP").value
    let nuevoComentario = new Object()
    nuevoComentario.prompt = comentario
    evaluarPelicula(nuevoComentario, nuevaPelicula)
}

function evaluarPelicula(nuevoComentario, nuevaPelicula) {
    fetch(`${URLBASE}/genai`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoComentario)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            if (informacion.codigo != 200) {
                ocultarPantallas()
                ocultarMenu()
                LOGIN.style.display = "block"
                mostrarMenuComun()
                localStorage.removeItem("token")
                mostrarMensaje("ERROR", informacion.codigo, "No se pudo evaluar la pelicula", 2000)
            } else {
                let score = Number(informacion.score)
                console.log(score)
                if (score > 0) {
                    registrarPelicula(nuevaPelicula)
                } else {
                    mostrarMensaje("ERROR", informacion.codigo, "La opinion de la pelicula fue negativa", 2000)
                }
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function registrarPelicula(nuevaPelicula) {
    fetch(`${URLBASE}/peliculas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(nuevaPelicula)
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo == 200) {
                mostrarMensaje("SUCCESS", informacion.codigo, informacion.mensaje, 2000)
            } else {
                mostrarMensaje("ERROR", informacion.codigo, informacion.mensaje, 2000)
            }
            limpiarRegistrarP()
        })
        .catch(function (error) {
            console.log(error)
        })
}

function previaListarPeliculas() {
    obtenerCategorias("listarPeliculas")
}

function listarPeliculas() {
    let miLista = ``
    let listaPeliculasFiltradas = new Array()
    let filtroP = document.querySelector("#slcFiltroListaP").value
    if (filtroP == "semana") {
        for (let p of peliculas) {
            console.log(calcularDifDias(p.fechaEstreno) <= 7)
            console.log(calcularDifDias(p.fechaEstreno))
            if (calcularDifDias(p.fechaEstreno) <= 7) {
                listaPeliculasFiltradas.push(p)
            }
        }
    }
    if (filtroP == "mes") {
        for (let p of peliculas) {
            if (calcularDifDias(p.fechaEstreno) <= 30) {
                listaPeliculasFiltradas.push(p)
            }
        }
    }
    if (filtroP == "todas") {
        listaPeliculasFiltradas = peliculas
    }
    let miCategoria
    console.log(categorias)
    for (let p of listaPeliculasFiltradas) {
        for (let c of categorias) {
            if (c.id == p.idCategoria) {
                miCategoria = c
            }
        }
        miLista += `<ion-item>
                        
                        <ion-label>${p.nombre}</ion-label>
                        <ion-label>${miCategoria.emoji}</ion-label>
 
                        <ion-button slot="end"
                        id="btnEliminarPelicula"
                        color="danger"
                        onclick="eliminarPelicula(${p.id})"
                        >Eliminar</ion-button
                        >
                    </ion-item>`
    }
    document.querySelector("#contenedorListaPeliculas").innerHTML = miLista
}

function obtenerCategorias(opcion) {
    fetch(`https://movielist.develotion.com/categorias `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)

            if (informacion.codigo != 200) {
                ocultarPantallas()
                ocultarMenu()
                LOGIN.style.display = "block"
                mostrarMenuComun()
                localStorage.removeItem("token")
                mostrarMensaje("ERROR", informacion.codigo, "No se pudo obtener las categorias", 2000)
            } else {
                categorias = informacion.categorias
                obtenerPeliculas(opcion)
            }

        })
        .catch(function (error) {
            console.log(error)
        })
}

function eliminarPelicula(id) {
    fetch(`${URLBASE}/peliculas/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })

        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {
            if (informacion.codigo != 200) {
                mostrarMensaje("ERROR", informacion.codigo, informacion.mensaje, 2000)
            } else {
                console.log(informacion)
                mostrarMensaje("SUCCESS", informacion.codigo, informacion.mensaje, 2000)
                previaListarPeliculas()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function calcularDifDias(startDate) {
    let start = new Date(startDate);
    let end = new Date();
    let diferenciaTiempo = end - start;
    let diferenciaDias = 0
    if (diferenciaTiempo > 0) {
        diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);
    }
    return Math.round(diferenciaDias);
}

function miUbicacion(posicion) {
    latitud = -23.442503
    longitud = -58.443832
    /*setTimeout(function () { armarMapa() }, 2000);*/
}

function armarMapa() {
    if (map != null) {
        map.remove()
    }
    map = L.map('map').setView([latitud, longitud], 3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    previaCargarUsuariosPorPais()
}

function previaCargarUsuariosPorPais() {
    fetch(`${URLBASE}/usuariosPorPais `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo != 200) {
                ocultarPantallas()
                ocultarMenu()
                LOGIN.style.display = "block"
                mostrarMenuComun()
                localStorage.removeItem("token")
                mostrarMensaje("ERROR", informacion.codigo, "No se pudo cargar usuarios por pais", 2000)
            } else {
                usuariosPorPais = informacion.paises
                cargarUsuariosPorPais()
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function cargarUsuariosPorPais() {
    let argentina = L.marker([listaPaises[0].latitud, listaPaises[0].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[0].id) {
            argentina.bindPopup("<b>" + listaPaises[0].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let bolivia = L.marker([listaPaises[1].latitud, listaPaises[1].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[1].id) {
            bolivia.bindPopup("<b>" + listaPaises[1].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let brazil = L.marker([listaPaises[2].latitud, listaPaises[2].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[2].id) {
            brazil.bindPopup("<b>" + listaPaises[2].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let chile = L.marker([listaPaises[3].latitud, listaPaises[3].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[3].id) {
            chile.bindPopup("<b>" + listaPaises[3].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let colombia = L.marker([listaPaises[4].latitud, listaPaises[4].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[4].id) {
            colombia.bindPopup("<b>" + listaPaises[4].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let ecuador = L.marker([listaPaises[5].latitud, listaPaises[5].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[5].id) {
            ecuador.bindPopup("<b>" + listaPaises[5].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let paraguay = L.marker([listaPaises[6].latitud, listaPaises[6].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[6].id) {
            paraguay.bindPopup("<b>" + listaPaises[6].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let peru = L.marker([listaPaises[7].latitud, listaPaises[7].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[7].id) {
            peru.bindPopup("<b>" + listaPaises[7].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let uruguay = L.marker([listaPaises[8].latitud, listaPaises[8].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[8].id) {
            uruguay.bindPopup("<b>" + listaPaises[8].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }
    let venezuela = L.marker([listaPaises[9].latitud, listaPaises[9].longitud]).addTo(map)
    for (let upp of usuariosPorPais) {
        if (upp.id == listaPaises[9].id) {
            venezuela.bindPopup("<b>" + listaPaises[9].nombre + "</b><br>" + upp.cantidadDeUsuarios)
        }
    }

}

function previaMostrarEstadisticas() {
    obtenerCategorias("estadisticas")
}

function mostrarEstadisticas() {
    let miLista1 = `<ion-list-header>
                        <ion-label>Cantidad de peliculas por categoria:</ion-label>
                    </ion-list-header>`
    let miLista2 = `<ion-list-header>
                        <ion-label>Porcentaje de películas registradas aptas para mayores de 12 años:</ion-label>
                    </ion-list-header>`
    for (let c of categorias) {
        let cont = 0
        for (let p of peliculas) {
            if (c.id == p.idCategoria) {
                cont++
            }
        }
        miLista1 += `<ion-item>
                        <ion-label>${c.nombre} - ${cont}</ion-label>
                    </ion-item>`
    }
    document.querySelector("#listaEstadisticas1").innerHTML = miLista1
    let cont = 0
    for (let c of categorias) {
        if (c.edad_requerida >= 12) {
            for (let p of peliculas) {
                if (c.id == p.idCategoria) {
                    cont++
                }
            }
        }
    }
    let porcentaje = 0
    if (cont != 0) {
        porcentaje = Math.round((cont / peliculas.length) * 100)
    }
    miLista2 += `<ion-item>
                    <ion-label>${porcentaje}%</ion-label>
                 </ion-item>`
    document.querySelector("#listaEstadisticas2").innerHTML = miLista2
}

function obtenerPeliculas(opcion) {
    fetch(`${URLBASE}/peliculas `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            console.log(informacion)
            if (informacion.codigo != 200) {
                ocultarPantallas()
                ocultarMenu()
                LOGIN.style.display = "block"
                mostrarMenuComun()
                localStorage.removeItem("token")
                mostrarMensaje("ERROR", informacion.codigo, "No se pudo obtener las peliculas", 2000)
            } else {
                peliculas = informacion.peliculas
                if (opcion == "listarPeliculas") {
                    listarPeliculas()
                }
                if (opcion == "estadisticas") {
                    mostrarEstadisticas()
                }
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function limpiarRegistrarU() {
    document.querySelector("#txtNombreRegistroU").value = ""
    document.querySelector("#txtPasswordRegistroU").value = ""
}

function limpiarLogin() {
    document.querySelector("#txtLoginU").value = ""
    document.querySelector("#txtLoginPass").value = ""
}

function limpiarRegistrarP() {
    document.querySelector("#txtNombreRegistroP").value = ""
    document.querySelector("#txtComentarioRegistroP").value = ""
}