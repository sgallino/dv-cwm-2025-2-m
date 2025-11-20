<script setup>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

/*
El atributo setup de <script> nos permite declarar que este componente usa la API de Composition.
Esto automáticamente implica:
- No podemos hacer un export default. Lo va a agregar el compilador de Vue.
- Por consiguiente, no necesitamos aclarar ni el nombre del componente ni declarar los componentes que usamos.
*/
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <!-- 
        RouterView es un componente de Vue Router. Se registra globalmente
        cuando agregamos el "app.use(router)" en [main.js].
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>