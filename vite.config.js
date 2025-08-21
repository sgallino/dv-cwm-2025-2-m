// Este es el archivo de configuración de Vite.
// Como sucede con todos los archivos ".config.js" debe retornar un objeto por
// defecto con la configuración.
// Para instalar este plugin, corrimos el comando:
//  npm install --save-dev @vitejs/plugin-vue
//
// ¿Qué significa el flag "--save-dev" (o "-D")?
// Significa que queremos que la dependencia se instale como una "devDependency",
// o sea, dependencia de desarrollo.
// ¿Y qué signfica "dependencia de desarrollo"?
// Las dependencias de desarrollo ("dev dependencies") son aquellas que solo
// necesitan instalarse en los entornos de desarrollo o testing. Pero no son
// necesarias en los entornos de producción.
import vue from '@vitejs/plugin-vue';

export default {
    // La propiedad "plugins" recibe un array con los plugins que queremos
    // sumar a Vite. Generalmente, cada plugin se obtiene ejecutando una
    // función.
    plugins: [vue()],
}