
<template>
    <div class="language-dropdown">
        <USelectMenu
            v-model="selected"
            @update:model-value="navigateTo(switchLocalePath(($event.toLowerCase() as 'nl' | 'en')))"
            :options="options"
            value-attribute="id"
            option-attribute="name"
            class="max-md:hidden w-16"
            variant="none"
            :ui-menu="{ width: 'w-36' }"
            :popper="{ placement: 'bottom-end' }"
        >
            <template #option="{ option: l }" class="min-w-fit">
                <img :src="`/images/flag/${l.id.toUpperCase()}.png`" />
                <span class="text-sm">{{ $t(`_language.${l.name.toLowerCase()}`) }}</span>
            </template>
        </USelectMenu>
    </div>
</template>

<script setup lang="ts">
const { locale, availableLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const options = computed(() => availableLocales.map(l => ({
  id: l.toUpperCase(),
  name: l.toUpperCase(),
})));

const selected = ref(locale.value.toUpperCase());
</script>
