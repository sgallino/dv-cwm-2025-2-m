import { supabase } from "./supabase";

/**
 * Guarda un nuevo mensaje para el chat global en la base de datos.
 * 
 * @param {{email: String, content: String}} data Los datos del nuevo mensaje
 */
export async function sendNewGlobalChatMessage({email, content}) {
    const { data, error } = await supabase
        .from('global_chat_messages')
        .insert({
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
 * @returns {Promise<{id: String, email: String, content: String, created_at: String}[]>}
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
 */
export function subscribeToNewGlobalChatMessages(callback) {
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
            callback(payload.new);
        }
    );

    // Pedimos "suscribirnos" al canal. Hasta acá, configuramos el canal, pero es recién
    // cuando nos suscribimos que empezamos a recibir la data.
    chatChannel.subscribe();
}