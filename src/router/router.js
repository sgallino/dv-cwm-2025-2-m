import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthStateChanges } from "../services/auth";
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";

// Creamos el array de rutas para el router.
// Cada ruta debe ser un objeto que contenga al menos 2 propiedades:
// - path. La URL a partir de la raíz del sitio.
// - component. El componente a renderizar para esa ruta.
// Además, las rutas pueden tener varias propiedades opcionales.
// - meta: Un objeto de "meta data". Esto objeto no tiene propiedades preestablecidas, sino que sirve para que
//  podamos agregar cualquier data arbitraria a la ruta.
const routes = [
    { path: '/',                        component: Home, },
    { path: '/ingresar',                component: Login,           meta: { requiresGuest: true, }, },
    { path: '/crear-cuenta',            component: Register,        meta: { requiresGuest: true, }, },
    { path: '/chat',                    component: GlobalChat,      meta: { requiresAuth: true, }, },
    { path: '/mi-perfil',               component: MyProfile,       meta: { requiresAuth: true, }, },
    { path: '/mi-perfil/editar',        component: MyProfileEdit,   meta: { requiresAuth: true, }, },
];

// El router se crea con createRouter que recibe un objeto de 2
// propiedades:
// 1. routes. El array de rutas.
// 2. history. El modo de historial de navegación que queremos usar.
//  Puede ser creado con createWebHistory o createWebHashHistory.
// El primero crea rutas de maneras parezcan URLs reales, a través de la
// API History de JS.
// El segundo crea las rutas usando el "hash" de la URL.
// Por ejemplo, las rutas con createWebHistory serían:
//  - /
//  - /chat
//  - /ingresar
//  - /crear-cuenta
// Mientras que con createWebHashHistory serían:
//  - /#/
//  - /#/chat
//  - /#/ingresar
//  - /#/crear-cuenta
// El createWebHistory() crea URLs más limpias, y que son mucho mejores para
// el SEO de la web. Lo que sí, para funcionar correctamente, requieren tener
// un servidor web debidamente configurado.
// Mientras que createWebHashHistory() no requiere ninguna configuración
// de ningún tipo para funcionar. Pero las rutas son muy problemáticas para
// SEO.
// ¿Cuál conviene?
// En general, siempre es mejor el createWebHistory(), sobretodo si 
// necesitamos un buen soporte para SEO.
// Pero si el sitio es una intranet, o solo es accesible a través de un
// login previo, entonces createWebHashHistory() es viable, porque no
// necesitamos tener en cuenta a los motores de búsqueda.
const router = createRouter({
    // Equivalente a:
    // routes: routes,
    routes,
    history: createWebHistory(),
});

// Manejar el acceso a las rutas. La idea es que si una ruta requiere que el usuario esté autenticado, solo
// le permitamos ingresar si lo está.
let user = {
    id: null,
    email: null,
}
subscribeToAuthStateChanges(userState => user = userState);

// Para verificar si la ruta requiere de autenticación, y analizar si permitimos la navegación o no, vamos a usar
// los "navigation guards" de Vue Router.
// Un "navigation guard" es una función que se ejecuta cuando se inicia una navegación de una ruta a otra.
// Nos permite controlar si permitimos que esa navegación ocurra a través de un callback. Si no retorna nada, la
// navegación se permite. Si retorna false, la navegación se cancela. Y si retorna una URL o un objeto de ruta,
// redirecciona.
// Router.beforeEach es un "global guard" que se ejecuta antes de todas las navegaciones que se pidan.
// Como todo "navegation guard" recibe un callback, al que le va a pasar las rutas a la que se accede y de la que
// se proviene.
router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && user.id === null) {
        return '/ingresar';
    }

    if(to.meta.requiresGuest && user.id !== null) {
        return '/mi-perfil';
    }

    // console.group('🚦 Router');
    // console.log("Ruta desde: ", from);
    // console.log("Ruta hacia: ", to);
    // console.groupEnd();
});

export default router;