<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';

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
            },
        }
    },
    mounted() {
        subscribeToAuthStateChanges(async userState => {
            this.user = userState;

            // // Ahora que cambiaron los datos del usuario autenticado, vamos a buscar la data del
            // // perfil.
            // const profile = await fetchUserProfileById(this.user.id);
            // this.user = {
            //     ...this.user,
            //     ...profile,
            // }
        });
    }
}
</script>

<template>
    <div class="flex gap-4 items-end">
        <AppH1>Mi perfil</AppH1>
        <RouterLink class="mb-4 text-blue-700 underline" to='/mi-perfil/editar'>Editar</RouterLink>
    </div>

    <div class="ms-4 my-8 text-gray-800 italic">{{ user.bio ?? 'Sin especificar...' }}</div>
        
    <dl>
        <dt class="mb-1 font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="mb-1 font-bold">Usuario</dt>
        <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
        <dt class="mb-1 font-bold">Carrera</dt>
        <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
    </dl>
</template>