import { supabase } from "./supabase";

/**
 * Guarda un nuevo mensaje para el chat global en la base de datos.
 * 
 * @param {{sender_id: string, email: string, content: string}} data Los datos del nuevo mensaje
 */
export async function sendNewGlobalChatMessage({sender_id, email, content}) {
    const { data, error } = await supabase
        .from('global_chat_messages')
        .insert({
            sender_id,
            email,
            content,
        });
    
    if(error) {
        console.error('[auth.js sendNewGlobalChatMessage] Error al insertar el mensaje.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @returns {Promise<{id: string, email: string, content: string, created_at: string}[]>}
 */
export async function fetchLastGlobalChatMessages() {
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
        console.error('[auth.js fetchLastGlobalChatMessage] Error al traer los mensajes de chat.', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {(messageData: {id: String, email: String, content: String, created_at: String}) => void} callback 
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToNewGlobalChatMessages(callback) {
    console.log("Suscrito al evento");

    // Actualización en tiempo real de los nuevos mensajes.
    // Vamos a usar la API de Postgres Changes que Supabase Realtime ofrece.
    // Primero, creamos el canal.
    // Lo importante es el nombre del canal, que sería su id. Pueden poner cualquier
    // string excepto "realtime".
    const chatChannel = supabase.channel('global_chat_messages');
    console.log("Suscripción al chat: ", chatChannel.state);

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
            console.log('Recibimos un nuevo mensaje: ', payload);
            callback(payload.new);
        }
    );

    // Pedimos "suscribirnos" al canal. Hasta acá, configuramos el canal, pero es recién
    // cuando nos suscribimos que empezamos a recibir la data.
    // Es importante tener en mente que no podemos suscribirnos a un canal si ya estamos suscritos.
    chatChannel.subscribe(status => {
        console.log("Suscripción al chat: ", status);

    });
    
    // Siempre que nos suscribimos a algo, tenemos que ofrecer algún mecanismo para cancelar esa suscripción.
    // La forma más simple de ofrecer esto es haciendo que la función que suscribe el observer retorne una
    // nueva función que al ejecutarse cancele la suscripción.
    return () => {
        chatChannel.unsubscribe();
        // console.log("Suscripción al chat cancelada.");
    }
}