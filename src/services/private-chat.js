import { supabase } from "./supabase";

// TODO: RLS del chat privado. Empezar la migración de Vue a la Composition API.

// Armamos un simple sistemita de caché, que dure hasta que el usuario refresque la página.
// Vamos a guardar los chats privados que recibimos en un objeto.
// Cada chat lo vamos a grabar con una clave que sea la combinación ordenada de los ids de ambos usuarios, unidos
// con un "_".
// Por ejemplo: 'userId1_userId2'.
let privateChatCache = {}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {{id: number, user_id1: string, user_id2: string, created_at: string}} chat 
 */
function addToPrivateChatCache(senderId, receiverId, chat) {
    const key = [senderId, receiverId].sort().join('_');
    privateChatCache[key] = chat;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {{id: number, user_id1: string, user_id2: string, created_at: string}}
 */
function getFromPrivateChatCache(senderId, receiverId) {
    const key = [senderId, receiverId].sort().join('_');
    return privateChatCache[key] ?? null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function fetchOrCreatePrivateChatFor(senderId, receiverId) {
    // Primero, preguntamos si tenemos el chat en el caché.
    const cached = getFromPrivateChatCache(senderId, receiverId);
    if(cached) return cached;

    let privateChat = await fetchPrivateChatFor(senderId, receiverId);

    if(!privateChat) {
        privateChat = await createPrivateChatFor(senderId, receiverId);
    }

    // Guardamos el chat obtenido en el caché.
    addToPrivateChatCache(senderId, receiverId, privateChat);

    return privateChat;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}|null>}
 */
async function fetchPrivateChatFor(senderId, receiverId) {
    // Ordenamos los IDs.
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .select()
        .eq('user_id1', userId1)
        .eq('user_id2', userId2);
    
    if(error) {
        console.error('[private-chat.js fetchPrivateChatFor] Error al obtener la conversación privada.', error);
        throw new Error(error.message);
    }

    return data[0] ?? null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, user_id1: string, user_id2: string, created_at: string}>}
 */
async function createPrivateChatFor(senderId, receiverId) {
    // Ordenamos los IDs.
    const [userId1, userId2] = [senderId, receiverId].sort();

    const { data, error } = await supabase
        .from('private_chats')
        .insert({
            user_id1: userId1,
            user_id2: userId2,
        })
        // Pedimos que nos traiga el registro recién insertado.
        .select();
    
    if(error) {
        console.error('[private-chat.js createPrivateChatFor] Error al crear la conversación privada.', error);
        throw new Error(error.message);
    }

    return data[0];
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} content 
 */
export async function sendNewPrivateChatMessage(senderId, receiverId, content) {
    // Para poder grabar el mensaje necesitamos tener el chat privado.
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const { error } = await supabase
        .from('private_chat_messages')
        .insert({
            chat_id: privateChat.id,
            sender_id: senderId,
            content,
        });

    if(error) {
        console.error('[private-chat.js sendNewPrivateChatMessage] Error al enviar el mensaje de la conversación privada.', error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<{id: number, chat_id: number, sender_id: string, content: string, created_at: string}[]>}
 */
export async function fetchLastPrivateChatMessages(senderId, receiverId) {
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const { data, error } = await supabase
        .from('private_chat_messages')
        .select()
        .eq('chat_id', privateChat.id)
        /*.limit(10)*/;

    if(error) {
        console.error('[private-chat.js fetchLastPrivateChatMessages] Error al traer los mensajes de la conversación privada.', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {(messages: {id: number, chat_id: number, sender_id: string, content: string, created_at: string}[]) => void} callback 
 * @returns {() => void} Función para desuscribirse.
 */
export async function subscribeToNewPrivateChatMessages(senderId, receiverId, callback) {
    const privateChat = await fetchOrCreatePrivateChatFor(senderId, receiverId);

    const privateChannel = supabase.channel('private_chat_messages');
    
    privateChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            table: 'private_chat_messages',
            // No queremos traer los mensajes de *todas* las conversaciones. Solo los de la conversación entre
            // estos usuarios.
            filter: 'chat_id=eq.' + privateChat.id,
        },
        payload => {
            console.log("Hola");
            
            callback(payload.new);
        }
    );

    privateChannel.subscribe();

    return () => {
        privateChannel.unsubscribe();
    }
}