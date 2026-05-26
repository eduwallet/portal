<template>
    <footer class="footer">
        <Tools />
    </footer>
</template>

<style lang="css" scoped>
@reference "tailwindcss";
@reference "@nuxt/ui";
.footer {
    @apply
        fixed
        bottom-0
        w-full
    ;
}
</style>