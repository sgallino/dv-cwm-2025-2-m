<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import AppH1 from '../components/AppH1.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { fetchLastGlobalChatMessages, sendNewGlobalChatMessage, subscribeToNewGlobalChatMessages } from '../services/global-chat';

const user = useAuthUserState();
const { messages } = useGlobalChatMessages();
const { newMessage, handleSubmit } = useGlobalChatNewMessageForm(user);

function useGlobalChatMessages() {
    let unsubscribeFromChat = () => {}

    const messages = ref([]);
    // Para poder usar los elementos asociados a un "ref" en el template tenemos que usar el composable
    // useTemplateRef() de Vue.
    // Este composable recibe como argumento el valor del atributo "ref" del elemento que queremos traer, y
    // retorna un ref() con el elemento.
    const chatContainer = useTemplateRef('chatContainer');

    onMounted(async () => {
        try {
            unsubscribeFromChat = subscribeToNewGlobalChatMessages(async receivedMessage => {
                messages.value.push(receivedMessage);

                // nextTick() es una función que podemos importar.
                await nextTick();
                
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            });

            messages.value = await fetchLastGlobalChatMessages();
            await nextTick();

            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        } catch (error) {
            console.error('[GlobalChat] ', error)
        }
    });

    onUnmounted(() => {
        console.log("Desuscrito");
        
        unsubscribeFromChat();
    });

    return {
        messages,
    }
}

function useGlobalChatNewMessageForm(user) {
    const newMessage = ref({
        content: '',
    });

    async function handleSubmit() {
        try {
            await sendNewGlobalChatMessage({
                sender_id: user.value.id,
                email: user.value.email,
                content: newMessage.value.content,
            });
            
            newMessage.value.content = '';
        } catch (error) {
            // TODO:
        }
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <!-- 
        # Template refs
        Un template refs es el mecanismo de Vue par brindarnos el elemento del DOM de alguna etiqueta del
        <template>.
        Para usarlos, necesitamos agregar en la etiqueta en cuestión un atributo "ref" con un identificador.
        -->
        <section ref="chatContainer" class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>
            <!-- 
            Los atributos que empiezan con "v-" son directivas, que son funciones
            que asociamos a un elemento y aplican alguna transformación o acción
            sobre él.
            -->
            <ol class="flex flex-col items-start gap-4">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-4 rounded bg-gray-100"
                >
                    <div class="mb-1">
                        <RouterLink 
                            class="font-bold text-blue-700 underline"
                            :to="`/usuario/${message.sender_id}`"
                        >
                            {{ message.email }}
                        </RouterLink> 
                        dijo:
                    </div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </section>
        <section class="w-3/12">
            <h2 class="mb-4 text-2xl">Enviar un mensaje</h2>
            <form
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span class="block mb-2">Email</span>
                    {{ user.email }}
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-2">Mensaje</label>
                    <!-- 
                    v-model define un "two-way data binding".
                    Esto signfica que Vue mantiene en sincronía el valor del state con el valor del
                    control (campo) de formulario.
                    Es decir, si el valor del state cambia, Vue modifica el valor del campo.
                    Y asimismo, si el usuario cambia el valor del campo, Vue actualiza el valor del
                    state.
                    Internamente, Vue maneja el valor del state como la "único origen de verdad"
                    (single source of truth).
                    -->
                    <textarea
                        id="content"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>