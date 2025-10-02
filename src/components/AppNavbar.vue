<script>
import { logout, subscribeToAuthStateChanges } from '../services/auth';

export default {
    name: 'AppNavbar',
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    methods: {
        handleSubmit() {
            logout();

            // Redireccionamos al login.
            // Esto lo hacemos con el método push() del Router.
            // Al Router lo podemos acceder desde la propiedad especial $router.
            this.$router.push('/ingresar');
        },
    },
    mounted() {
        // Nos suscribimos para recibir los datos del usuario autenticado.
        subscribeToAuthStateChanges(userState => this.user = userState);
    },
}
</script>

<template>
    <!-- 
    # Formato de las clases de Tailwind
    En Tailwind los nombres de las clases tienen típicamente uno de dos formatos:
    1. <estilo>-<valor>
        El nombre se compone de estas dos partes para indicar lo que queremos agregar.
        Por ejemplo:
            .p-4                    padding: 1rem;
            .text-white             color: #fff;
            .bg-slate-200           background-color: #e2e8f0;
    
    2. <valor>
        En algunas clases donde los valores del estilo son lo suficientemente
        únicos, Tailwind usa solo el valor como el nombre.
        Por ejemplo:
            .flex                   display: flex;
            .underline              text-decoration: underline;
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-200">
        <RouterLink class="text-xl" to="/">DV Social</RouterLink>
        
        <ul class="flex gap-4">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <template v-if="user.id !== null">
                <li>
                    <RouterLink to="/chat">Chat</RouterLink>
                </li>
                <li>
                    <RouterLink to="/mi-perfil">Mi perfil</RouterLink>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleSubmit"
                    >
                        <button type="submit">{{ user.email }} (Cerrar sesión)</button>
                    </form>
                </li>
            </template>
            <template v-else>
                <li>
                    <RouterLink to="/ingresar">Ingresar</RouterLink>
                </li>
                <li>
                    <RouterLink to="/crear-cuenta">Crear cuenta</RouterLink>
                </li>
            </template>
        </ul>
    </nav>
</template>