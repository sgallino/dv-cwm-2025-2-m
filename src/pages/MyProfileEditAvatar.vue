<script>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuthStateChanges, updateAuthUserAvatar, updateAuthUserProfile } from '../services/auth';

let unsubscribeFromAuth = () => {}

export default {
    name: 'MyProfileEditAvatar',
    components: { AppH1, },
    data() {
        return {
            imageData: {
                file: null,
                preview: null,
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                // Si ya está subiendo un archivo o si no hay una imagen, no hacemos nada.
                if(this.loading || !this.imageData.file) return;

                this.loading = true;

                await updateAuthUserAvatar(this.imageData.file);
            } catch (error) {
                throw error;
            }
            this.loading = false;
        },
        handleImageChange(event) {
            /*
                Todas las funciones que asociamos a un evento nativo de HTML (como el onchange) reciben como 
                argumento el objeto Event nativo.
                Eso nos da acceso a varias cosas, como el "target", que contiene el elemento que disparó el evento.
                En el caso donde el elemento es un <input type="file"> vamos a tener una propiedad llamada "files"
                de tipo FileList que contiene los archivos que se hayan seleccionado.
                En esencia, un FileLst es un array de objetos File.
                Un objeto File representa un archivo. Contiene datos como el type (tipo MIME) o el size (peso en
                bytes).
                Como nuestro <input> no tiene el atributo "multiple" asignado, solo se puede seleccionar un archivo
                por vez. Así que podemos darnos el lujo de hardcodear la posición 0.
            */
            this.imageData.file = event.target.files[0];

            if(this.imageData.preview) {
                // Limpiamos la imagen anterior de la memoria.
                URL.revokeObjectURL(this.imageData.preview);
            }

            // Si cambió la imagen pero no seleccionó una nueva, entonces limpiamos y cortamos la función.
            if(!this.imageData.file) {
                this.imageData.preview = null;
                return;
            }

            /*
                Para hacer la previsualización necesitamos leer de alguna manera el archivo que se seleccionó.
                Hay más de una forma de hacerlo. La más simple probablemente es usando el método URL.createObjectURL.
                Este método lo que hace es:
                - Lee y guarda el archivo que le pasamos por parámetro en la memoria.
                - Le asigna una URL nueva asociada al dominio de la web, que es que el método retorna.
                - Esa ruta y archivo en memoria quedan asociados al "document" de la página.

                Esto último es especialmente importante.
                Significa que cada vez que hacemos un createObjectURL se levanta en memoria el archivo y queda
                asociado al document. En otras palabras, hasta que el document no se "descargue" (por ejemplo, si
                el usuario refresca la página o navega a otra URL) esos recursos siguen ocupando espacio en memoria.
                En una MPA tradicional, esto no supone problema alguno, ya que las páginas viven por poco tiempo.
                Pero en una página que vive por largo tiempo, como una SPA, la historia es distinta. Si no somos
                cuidadosos, vamos a empezar a tener filtraciones de memoria (memory leaks) al ir creando una y otra
                vez objectURLs.
                Para evitarlo, "solo" tenemos que recordar "revocar" esa URL cuando ya no la necesitemos.
                Por ejemplo, lo tendríamos que hacer cuando naveguemos a otro componente (usando el unmounted) o
                cuando se seleccione una nueva imagen.
            */
            this.imageData.preview = URL.createObjectURL(this.imageData.file);
        },
    },
    unmounted() {
        // Limpiamos, si existe, la imagen cargada en la memoria.
        if(this.imageData.preview) {
            URL.revokeObjectURL(this.imageData.preview);
        }
    }
    // mounted() {
    //     unsubscribeFromAuth = subscribeToAuthStateChanges(userState => {
    //         this.formData = {
    //             display_name: userState.display_name,
    //             bio: userState.bio,
    //             career: userState.career,
    //         }
    //     });
    // },
    // unmounted() {
    //     unsubscribeFromAuth();
    // }
}
</script>

<template>
    <AppH1>Editar mi foto de perfil</AppH1>

    <div class="flex gap-4">
        <form 
            action="#"
            class="w-1/2"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="image" class="block mb-2">Foto</label>
                <input
                    type="file"
                    id="image"
                    class="w-full p-2 border border-gray-300 rounded"
                    @change="handleImageChange"
                >
            </div>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Actualizar mi foto</button>
        </form>
        <div class="w-1/2">
            <h2 class="text-lg">Imagen seleccionada</h2>
            <img
                v-if="imageData.preview !== null"
                :src="imageData.preview"
                alt=""
            >
            <span v-else>No hay una imagen seleccionada</span>
        </div>
    </div>
</template>