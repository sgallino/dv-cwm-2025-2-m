<script>
export default {
    name: 'AppNavbar',
}
</script>

<template>
    <!-- 
    # Formato de las clases de Tailwind
    En Tailwind los nombres de las clases tienen típicamente uno de dos formatos:
    1. <estilo>-<valor>
        El nombre se compone de estas dos partes para indicar lo que queremos agregar.
        Por ejemplo:
            .p-4                    padding: 1rem;
            .text-white             color: #fff;
            .bg-slate-200           background-color: #e2e8f0;
    
    2. <valor>
        En algunas clases donde los valores del estilo son lo suficientemente
        únicos, Tailwind usa solo el valor como el nombre.
        Por ejemplo:
            .flex                   display: flex;
            .underline              text-decoration: underline;
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-200">
        <RouterLink class="text-xl" to="/">DV Social</RouterLink>
        
        <ul class="flex gap-4">
            <li>
                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <RouterLink to="/chat">Chat</RouterLink>
            </li>
            <li>
                <RouterLink to="/ingresar">Ingresar</RouterLink>
            </li>
            <li>
                <RouterLink to="/crear-cuenta">Crear cuenta</RouterLink>
            </li>
        </ul>
    </nav>
</template>