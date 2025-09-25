import { supabase } from "./supabase";

const ERROR_MESSAGES_MAP = {
    'weak_password': 'La contraseña debe tener al menos 6 caracteres.',
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function register(email, password) {
    // Para trbajar con la autenticación de Supabase, podemos acceder a la propiedad auth del cliente de Supabase.
    // Entre sus métodos, tenemos "signUp" que nos permite registrar un usuario.
    // Recibe 1 parámetro:
    // 1. Objeto. Los datos del usuario. Puede recibir algunas propiedades, como "email" y "password".
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js register] Error al crear el nuevo usuario.', error);
        throw new Error(ERROR_MESSAGES_MAP[error.code] ?? error.message);
    }

    console.log('Nuevo usuario creado: ', data);
}

export async function login(email, password) {

}

export async function logout() {

}