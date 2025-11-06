<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { getFileURL } from '../services/storage';

let unsubscribeFromAuth = () => {} // La función es un placeholder.

export default {
    name: 'MyProfile',
    components: { AppH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
                photo_url: null,
            },
        }
    },
    methods: {
        generateFullURL(filename) {
            return getFileURL(filename);
        }
    },
    // TODO: Repasar computed properties
    // computed: {
    //     photoFullURL() {
    //         return this.user.photo_url ? getFileURL(this.user.photo_url) : null;
    //     }
    // },
    mounted() {
        // Capturamos la función para cancelar la suscripción.
        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => this.user = userState);
    },
    unmounted() {
        // Invocamos la función y cancelamos la suscripción.
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <div class="flex gap-4 items-end">
        <AppH1>Mi perfil</AppH1>
        <RouterLink class="mb-4 text-blue-700 underline" to='/mi-perfil/editar'>Editar</RouterLink>
        <RouterLink class="mb-4 text-blue-700 underline" to='/mi-perfil/editar/foto'>Editar mi foto</RouterLink>
    </div>

    <div class="flex gap-4">
        <div class="w-1/4">
            <img
                v-if="user.photo_url !== null"
                :src="generateFullURL(user.photo_url)"
                alt=""
            >
            <span v-else>Sin foto de perfil</span>
        </div>
        <div class="w-3/4">
            <div class="ms-4 my-8 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>
                
            <dl>
                <dt class="mb-1 font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="mb-1 font-bold">Usuario</dt>
                <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="mb-1 font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>
</template>