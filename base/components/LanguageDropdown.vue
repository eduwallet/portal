
<template>
    <div class="language-dropdown max-md:hidden mr-2">
        <UDropdownMenu :items="items">
            <UButton variant="ghost" color="neutral" size="sm" class="font-medium px-1" trailing-icon="i-heroicons-chevron-down-20-solid">
                {{ locale.toUpperCase() }}
            </UButton>
            <template #item="{ item }">
                <div class="flex items-center gap-2">
                    <img :src="`/images/flag/${item.id}.png`" class="w-4 h-auto" />
                    <span>{{ item.label }}</span>
                </div>
            </template>
        </UDropdownMenu>
    </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const { locale, availableLocales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const items = computed(() => [
    availableLocales.map(l => ({
        id: l.toUpperCase(),
        label: t(`_language.${l}`),
        onSelect: () => navigateTo(switchLocalePath(l)),
    }))
]);
</script>
