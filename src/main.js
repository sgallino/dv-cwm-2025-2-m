/*
# Rutas en los imports en archivos de JS con npm (y Vite)
Cuando agregamos un import de una ruta con especificar un directorio de origen,
por defecto, Vite y npm asumen que se trata de un paquete de npm que debe estar
instalado.
Por ejemplo, si hacemos:
  import { createApp } from "vue";

Se sobreentiende que "vue" es un paquete de npm, y existe en la carpeta de 
[node_modules].

Por este motivo, si tratamos de incluir un archivo con una ruta relativa
sin especificar el origen, como por ejemplo:
  import App from "App.vue";

No funciona. Porque Vite entiende que "App.vue" debería ser un paquete
instalado de npm que existe en la carpeta [node_modules].
Siempre que queramos referenciar un archivo propio que no sea parte de
[node_modules] necesitamos aclararlo con un directorio de origen.
Por ejemplo:
  - /
  - ./
  - ../

Quedando:
  import App from "App.vue";
*/
// import "./bootstrap.min.css";
import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";

const app = createApp(App);
app.use(router); // Registramos el router.
app.mount('#app');