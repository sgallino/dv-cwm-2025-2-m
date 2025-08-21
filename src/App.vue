<script>
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';

export default {
    name: 'App',
    // La propiedad "components" lleva un objeto con los componentes que queremos
    // usar dentro de éste.
    components: { AppNavbar, AppFooter },
}
</script>

<template>
    <AppNavbar />
    <main class="container py-3">
        <!-- 
        RouterView es un componente de Vue Router. Se registra globalmente
        cuando agregamos el "app.use(router)" en [main.js].
        -->
        <RouterView />
    </main>
    <AppFooter />
</template>