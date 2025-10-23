<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges } from '../services/auth';
import { fetchLastPrivateChatMessages, sendNewPrivateChatMessage, subscribeToNewPrivateChatMessages } from '../services/private-chat';
import { fetchUserProfileById } from '../services/user-profiles';

let unsubscribeFromChat = () => {} // El valor es un placeholder.
let unsubscribeFromAuth = () => {}

export default {
    name: 'PrivateChat',
    components: { AppH1, },
    data() {
        return {
            messages: [],
            loadingMessage: false,

            newMessage: {
                content: '',
            },

            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },

            otherUser: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    methods: {
        async handleSubmit() {
            try {
                await sendNewPrivateChatMessage(
                    this.user.id,
                    this.$route.params.id,
                    this.newMessage.content,
                );
                
                this.newMessage.content = '';
            } catch (error) {
                // TODO:
            }
        }
    },
    async mounted() {
        unsubscribeFromAuth = subscribeToAuthStateChanges(userState => this.user = userState);

        try {
            this.loadingMessage = true;
            
            fetchUserProfileById(this.$route.params.id)
                .then(userProfile => this.otherUser = userProfile);
            
            this.messages = await fetchLastPrivateChatMessages(
                this.user.id,
                this.$route.params.id,
            );
            this.loadingMessage = false;
            
            await this.$nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;

            unsubscribeFromChat = await subscribeToNewPrivateChatMessages(
                this.user.id,
                this.$route.params.id,
                async newMessage => {
                    this.messages.push(newMessage);
            
                    await this.$nextTick();
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
                }
            );
        } catch (error) {
            this.loadingMessage = false;
        }
    },
    unmounted() {
        unsubscribeFromChat(); // Llamamos a la función que guardamos para desuscribirnos.
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <AppH1>Chat private con {{ otherUser.email }}</AppH1>

    <section ref="chatContainer" class="overflow-y-auto h-100 p-4 mb-4 border border-gray-200 rounded">
        <h2 class="sr-only">Lista de mensajes</h2>
        <ol class="flex flex-col items-start gap-4">
            <li
                v-for="message in messages"
                :key="message.id"
                class="p-4 rounded"
                :class="{
                    'bg-gray-100': message.sender_id !== user.id,
                    'self-end bg-green-100': message.sender_id === user.id,
                }"
            >
                <div class="mb-1">{{ message.content }}</div>
                <div class="text-sm text-gray-700">{{ message.created_at }}</div>
            </li>
        </ol>
    </section>
    <section>
        <h2 class="sr-only">Enviar un mensaje</h2>
        <form
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <label for="content" class="sr-only">Mensaje</label>
            <textarea
                id="content"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="newMessage.content"
            ></textarea>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Enviar</button>
        </form>
    </section>
</template>