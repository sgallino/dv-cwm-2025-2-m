import { supabase } from "./supabase";

const ERROR_MESSAGES_MAP = {
    'weak_password': 'La contraseña debe tener al menos 6 caracteres.',
}

/*
# Manejando el estado de autenticación dentro de nuestra aplicación
Para poder hacer un uso ágil y robusto de nuestro estado de autenticación, necesitamos ofrecer algún mecanismo
a nuestros componentes y archivos de JS para notificarlos cada vez que cambie el estado de autenticación.
Esto implicaría pasarles los datos del usuario autenticado, si es que lo hay, y sino pasarle los datos con los
valores null.

Si bien hay mecanismos propios de Vue que podríamos usar (ej: emisión de eventos y propagación de propiedades,
API provide / inject, bibliotecas externas como Pinia), vamos a optar por una implementación que no quede atada a
Vue, sino que la podamos usar con cualquier framework de JS, o incluso con JS vanilla.

Nuestro método de elección va a ser el patrón de diseño Observer.

## Observer
https://refactoring.guru/design-patterns/observer

El patrón Observer permite modelar una relación de uno a muchos entre elementos del sistema.
Específicamente, sirve cuando tenemos múltiples potenciales elementos de nuestro sistema (que llamaremos
"observers") que están interesados en ser notificados de los cambios o sucesos ocurridos en algún otro
elemento del sistema (que llamaremos "subject").
Es decir, Observer busca ofrecer un mecanismo para que el "subject" pueda notificar a los "observers" interesados
de los cambios ocurridos.

La mayor parte del trabajo queda en manos del "subject".

Por ejemplo, esta definición se ajusta perfectamente a lo que buscamos lograr.
Tenemos un "subject" que sería la información del usuario autenticado. Que muchos de nuestros elementos (como
componentes o scripts) necesitan enterarse cuando esta data cambie.

El proceso de sumar un observer para ser notificado se suele llamar "suscripción". Solemos decir que un
observer se "suscribe" para recibir los datos.
Otros términos que también se usan en algunos casos en vez de "suscripción" incluyen "attach" (adjuntar),
"listen" (escuchar) y "watch" (observar).


Para implementar Observer hay que cumplir con algunos requisitos:
- Tener un "subject". En nuestro caso, vamos a usar una variable user.
- Tener un lugar donde guardar los "observers" interesados. Lo vamos a resolver con un array.
- Una función para que los "observers" puedan "suscribirse" a los cambios.
- Una función para "notificar" los "observers" que están "suscritos".
*/
let user = {
    id: null,
    email: null,
}
let observers = [];

// TODO: Levantar automáticamente los datos del usuario autenticado.

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
    // Cada vez que cambie algo del estado de autenticación o la información relacionada al usuario
    // vamos a actualizar el objeto user, y notificar a todos los observers.
    user = {
        id: data.user.id,
        email: data.user.email,
    }
    notifyAll();
}

/**
 * 
 * @param {String} email 
 * @param {String} password 
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if(error) {
        console.error('[auth.js login] Error al iniciar sesión.', error);
        throw new Error(ERROR_MESSAGES_MAP[error.code] ?? error.message);
    }

    console.log('Sesión iniciada con éxito: ', data);
    user = {
        id: data.user.id,
        email: data.user.email,
    }
    notifyAll();
}

export async function logout() {
    supabase.auth.signOut();

    user = {
        id: null,
        email: null,
    }
    notifyAll();
}

/*
+--------------------------------------------------------------
| Implementación de nuestro observer
+--------------------------------------------------------------
*/
/**
 * Registra un callback ("observer") que va a ejecutarse con los cambios en el estado de
 * autenticación.
 * El callback va a recibir una copia de los datos del usuario actual.
 * 
 * @param {Function} callback 
 */
export function subscribeToAuthStateChanges(callback) {
    // Agregamos el observer al stack.
    // Adicionalmente, para que el observer que se registra pueda recibir inmediatamente
    // los datos actuales, lo notificamos a continuación.
    observers.push(callback);

    notify(callback);
}

function notify(callback) {
    callback({...user}); // Importante: Noten que es una copia de la data.
}

function notifyAll() {
    observers.forEach(callback => notify(callback));
    // observers.forEach(notify);
}