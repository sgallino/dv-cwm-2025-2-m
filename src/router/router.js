import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import GlobalChat from "../pages/GlobalChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

// Creamos el array de rutas para el router.
// Cada ruta debe ser un objeto que contenga al menos 2 propiedades:
// - path. La URL a partir de la raíz del sitio.
// - component. El componente a renderizar para esa ruta.
const routes = [
    { path: '/',                        component: Home, },
    { path: '/chat',                    component: GlobalChat, },
    { path: '/ingresar',                component: Login, },
    { path: '/crear-cuenta',            component: Register, },
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

export default router;