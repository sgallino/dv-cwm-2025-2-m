<script>
import AppH1 from '../components/AppH1.vue';
import { fetchUserProfileById } from '../services/user-profiles';

export default {
    name: 'UserProfile',
    components: { AppH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true;

            // Para acceder a los datos de la ruta, tenemos el objeto this.$route.
            // Entre sus datos, tenemos "params" que nos da acceso a los parámetros
            // de ruta.
            this.user = await fetchUserProfileById(this.$route.params.id);
        } catch (error) {
            // TODO...
        }
        this.loading = false;
    }
}
</script>

<template>
    <AppH1>Perfil de {{ user.email }}</AppH1>

    <div class="ms-4 my-8 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>
        
    <dl class="mb-4">
        <dt class="mb-1 font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="mb-1 font-bold">Usuario</dt>
        <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
        <dt class="mb-1 font-bold">Carrera</dt>
        <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
    </dl>

    <hr class="mb-4">

    <RouterLink
        class="text-blue-700 underline"
        :to="`/usuario/${user.id}/chat`"
    >
        Iniciar conversación con {{ user.email }}
    </RouterLink>
</template>