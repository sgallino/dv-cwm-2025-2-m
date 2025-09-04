<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
    name: 'GlobalChat',
    components: { AppH1, },
    // data es la propiedad que nos permite definir los valores del "state" del componente.
    // Entendemos por "state" a los datos que son propios del componente y que pueden variar
    // con el tiempo.
    // El "state" en Vue es "reactivo".
    // Esto significa que el framework se encarga de re-renderizar la vista cada vez que el
    // "state" cambie.
    // Además, los datos del "state" son directamente accesibles desde el template.
    // La propiedad "data" debe recibir una función que retorne un objeto con el "state"
    // inicial.
    // data: function() {
    // },
    // data: () => {
    // }
    data() {
        return {
            messages: [],
            newMessage: {
                email: '',
                content: '',
            },
        }
    },
    methods: {
        handleSubmit() {
            this.messages.push({
                id: this.messages.length,
                email: this.newMessage.email,
                content: this.newMessage.content,
                created_at: new Date(),
            });

            this.newMessage.content = '';
        }
    },
    async mounted() {
        // TODO: Repasar :D
        // Traemos las filas de la tabla global_chat_messages de Supabase.
        // El objeto de Supabase tiene múltiples métodos para interactuar con los servicios.
        // Noten, muy importante, el await.
        // Podemos considerar que es el "await" el que hace que el query se ejecute.
        const { data, error } = await supabase
            // .from() permite interactuar con alguna tabla de nuestro backend.
            .from('global_chat_messages')
            // .select() hace un select de los datos de la tabla.
            .select();

        if(error) {
            throw new Error(error);
        }

        this.messages = data;
    }
}
</script>

<template>
    <AppH1>Chat general</AppH1>

    <div class="flex gap-4">
        <section class="overflow-y-auto w-9/12 h-100 p-4 border border-gray-200 rounded">
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
                    <div class="mb-1"><span class="font-bold">{{ message.email }}</span> dijo:</div>
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
                    <label for="email" class="block mb-2">Email</label>
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
                    <input
                        type="email"
                        id="email"
                        class="w-full p-2 border border-gray-300 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="content" class="block mb-2">Mensaje</label>
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