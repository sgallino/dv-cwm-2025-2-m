import { supabase } from "./supabase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, created_at: string, display_name: string|null, career: string|null, bio: string|null}>}
 */
export async function fetchUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        // El filter .eq() (de equals) agrega una cláusula WHERE de igualdad.
        .eq('id', id)
        // El modificador limit() nos permite limitar cuántos registros impacta la consulta.
        .limit(1)
        // El modificador single() hace que en vez de retornar un array de objetos, se nos retorne un único objeto.
        .single();

    if(error) {
        console.error('[user-profiles.js fetchUserProfileById] Error al traer el perfil del usuario:', id, error)
        throw new Error(error.message);
    }

    return data;
}

/**
 * 
 * @param {{id: string, email: string, display_name?: string|null, bio?: string|null, career?: string|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario:', error)
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} id
 * @param {{display_name?: string|null, bio?: string|null, career?: string|null}} data 
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);

    if(error) {
        console.error('[user-profiles.js updateUserProfile] Error al editar el perfil del usuario:', id, error)
        throw new Error(error.message);
    }
}