
<template>
    <div class="language-switcher">
        <NuxtLink
            v-for="l in availableLocales"
            :key="l"
            :to="switchLocalePath(l)"
            :class="{
                'language-switcher__link--active': l === locale,
            }"
            class="language-switcher__link"
        >
            {{ l.toUpperCase() }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const { locale, availableLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<style lang="css" scoped>
.language-switcher {
    @apply
        flex
        gap-2
    ;
}

.language-switcher__link {
    @apply
        text-sm
        opacity-75
        hover:underline
    ;
}

.language-switcher__link--active {
    @apply
        opacity-100
        font-semibold
    ;
}
</style>
