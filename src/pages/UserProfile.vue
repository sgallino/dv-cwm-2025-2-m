<script setup>
import { onMounted, ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import { getFileURL } from '../services/storage';
import { fetchUserProfileById } from '../services/user-profiles';
import { useRoute } from 'vue-router';

const route = useRoute();
const { user, loading } = useUserProfile(route.params.id);

/*
Se considera en general una buena práctica que cualquier dependencia externa del composable (cualquier valor que
el composable necesita usar pero no define él mismo) se le provea como argumento.
*/
function useUserProfile(id) {
    const loading = ref(false);
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        career: null,
        photo_url: null,
    });

    onMounted(async () => {
        try {
            loading.value = true;

            user.value = await fetchUserProfileById(id);
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    });

    return {
        loading,
        user,
    }
}
</script>

<template>
    <AppH1>Perfil de {{ user.email }}</AppH1>

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
                
            <dl class="mb-4">
                <dt class="mb-1 font-bold">Email</dt>
                <dd class="mb-2">{{ user.email }}</dd>
                <dt class="mb-1 font-bold">Usuario</dt>
                <dd class="mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="mb-1 font-bold">Carrera</dt>
                <dd class="mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>

    <hr class="mb-4">

    <RouterLink
        class="text-blue-700 underline"
        :to="`/usuario/${user.id}/chat`"
    >
        Iniciar conversación con {{ user.email }}
    </RouterLink>
</template>