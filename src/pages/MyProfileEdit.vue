<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges, updateAuthUserProfile } from '../services/auth';

export default {
    name: 'MyProfileEdit',
    components: { AppH1, },
    data() {
        return {
            formData: {
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;

                await updateAuthUserProfile(this.formData);
            } catch (error) {
                // TODO...
            }
            this.loading = false;
        }
    },
    mounted() {
        subscribeToAuthStateChanges(userState => {
            this.formData = {
                display_name: userState.display_name,
                bio: userState.bio,
                career: userState.career,
            }
        });
    }
}
</script>

<template>
    <AppH1>Editar mi perfil</AppH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-2">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-2">Usuario</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-2">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="formData.career"
            >
        </div>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Actualizar mis datos</button>
    </form>
</template>