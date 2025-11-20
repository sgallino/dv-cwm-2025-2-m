<script setup>
import { ref } from 'vue';
import AppH1 from '../components/AppH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';

/*
En la Composition API los datos del state del componente (lo que en Options va en "data") se definen como variables
a las que les asignamos una llamada a una de las funciones de Vue para crear valores reactivos.
La más común, y la que algunos recomiendan usar siempre, es ref().
"ref()" define una "referencia reactiva". Es decir, que define un valor que cada vez que cambie provoca que
Vue re-renderice el <template> del componente.
Para lograrlo, ref envuelve el valor que le pasamos en un objeto con la clave "value". Es decir, si definimos:
    const loading = ref(false);

Lo que "loading" va a ser es similar a:
    const loading = { value: false };

Esto es relevante de tener presente. Cada vez que queramos leer o modificar el valor del ref desde el <script> 
vamos a tener que hacerlo modificando la propiedad value:
    loading.value = true; // ¡Bien!
    loading = true; // ¡Mal! Perdemos el ref.

Es importante recordar que en la Composition API no existe "this".

La ausencia de "this" tiene una implicancia extra: Todos los valores especiales como $router, $refs, $nextTick, etc,
no existen.

Si necesitamos usarlos, tenemos que obtenerlos de otra manera. Típicamente, con alguna función de Vue o sus paquetes.
Por ejemplo, si queremos usar el router, en vez de:
    this.$router....

Lo obtenemos:
    const router = useRouter();
*/
const router = useRouter();

const { user, loading, feedback, handleSubmit } = useLoginForm();

/*
Para usar la API de Composition de manera escalable, se recomienda que la lógica de cada responsabilidad que 
tengamos quede encapsulada en una función.
Estas funciones que contienen instrucciones de Vue en su interior (como ref()) las llamamos "composables".
Por convención, empiezan con el prefijo "use".

Estos composables deberían retornar los datos que el componente necesita tener.
El trabajo con los composables tiene varios beneficios:
- Permite organizar de manera más limpia las responsabilidades.
- Cada responsabilidad queda bien delimitada en lo que hace.
- Evita colisiones de nombres entre funciones o variables de diferentes responsabilidades.
- Facilita una eventual reutilización de esos valores.
- Facilita la legibilidad del código.
*/
function useLoginForm() {
    const loading = ref(false);
    const user = ref({
        email: '',
        password: '',
    });
    const feedback = ref({
        message: null,
    });

    /*
    Con respecto a los métodos, los definimos únicamente como funciones comunes y corrientes.
    */
    async function handleSubmit() {
        try {
            feedback.value.message = null;
            loading.value = true;
            
            await login(user.value.email, user.value.password);

            router.push('/mi-perfil');
        } catch (error) {
            feedback.value.message = error;
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <AppH1>Ingresar a mi cuenta</AppH1>

    <div 
        v-if="feedback.message !== null"
        class="p-4 mb-4 rounded bg-red-200 text-red-900"
    >{{ feedback.message }}</div>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Crear cuenta</button>
    </form>
</template>