<script>
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { AppH1, },
    data() {
        return {
            loading: false,
            user: {
                email: '',
                password: '',
            },

            feedback: {
                message: null,
            }
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.feedback.message = null;
                this.loading = true;
                
                await login(this.user.email, this.user.password);

                this.$router.push('/mi-perfil');
            } catch (error) {
                this.feedback.message = error;
            }
            this.loading = false;
        },
    },
}
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

    <div 
        v-if="feedback.message !== null"
        class="p-4 mb-4 rounded bg-red-200 text-red-900"
    >{{ feedback.message }}</div>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Crear cuenta</button>
    </form>
</template>