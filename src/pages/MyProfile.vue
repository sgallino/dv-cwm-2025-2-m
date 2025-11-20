<script setup>
import AppH1 from '../components/AppH1.vue';
import { getFileURL } from '../services/storage';
import useAuthUserState from '../composables/useAuthUserState';
// TODO: Repasar computed properties

const user = useAuthUserState();
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
                :src="getFileURL(user.photo_url)"
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