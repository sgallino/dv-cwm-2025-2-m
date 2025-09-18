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
        async handleSubmit() {
            // this.messages.push({
            //     id: this.messages.length,
            //     email: this.newMessage.email,
            //     content: this.newMessage.content,
            //     created_at: new Date(),
            // });
            // Insertamos el nuevo mensaje en Supabase.
            const { data, error } = await supabase
                .from('global_chat_messages')
                .insert({
                    email: this.newMessage.email,
                    content: this.newMessage.content,
                });
            
            if(error) {
                console.error('[GlobalChat handleSubmit] Error al insertar el mensaje.', error);
                return;
            }

            this.newMessage.content = '';
        }
    },
    async mounted() {
        // TODO: Mover estas funcionalidades a un servicio. Arrancar con la autenticación.
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
            console.error('[GlobalChat] Error al traer los mensajes de chat.', error);
            return;
            // throw new Error(error);
        }

        this.messages = data;

        // Actualización en tiempo real de los nuevos mensajes.
        // Vamos a usar la API de Postgres Changes que Supabase Realtime ofrece.
        // Primero, creamos el canal.
        // Lo importante es el nombre del canal, que sería su id. Pueden poner cualquier
        // string excepto "realtime".
        const chatChannel = supabase.channel('global_chat_messages');

        // Configuramos los eventos que queremos escuchar.
        // Los eventos se registran con el método "on".
        // Este método recibe 3 argumentos:
        // 1. String. El servicio de Supabase Realtime que queremos usar.
        // 2. Objeto. Los detalles del evento que queresmo escuchar.
        // 3. Function. El callback a ejecutar a ejecutar. Va a recibir comom parámetro el "payload"
        //  del evento.
        chatChannel.on(
            'postgres_changes',
            {
                // Para Postgres Changes puede ser el evento: INSERT, UPDATE, DELETE, *.
                event: 'INSERT',
                table: 'global_chat_messages',
                schema: 'public',
            },
            payload => {
                // console.log('Recibimos un nuevo mensaje: ', payload);
                this.messages.push(payload.new);
            }
        );

        // Pedimos "suscribirnos" al canal. Hasta acá, configuramos el canal, pero es recién
        // cuando nos suscribimos que empezamos a recibir la data.
        chatChannel.subscribe();
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