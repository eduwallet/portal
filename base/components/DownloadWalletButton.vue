<template>
  <NuxtLink
    class="p-5 md:pr-8 rounded-[10px] border border-gray-200 bg-white flex max-lg:flex-col gap-5 items-start justify-between"
    :class="{ 'hover:bg-opacity-30 transition-colors': !disabled }"
  >
    <div class="flex gap-5 sm:items-center max-sm:flex-wrap">
      <div class="h-auto w-12">
        <slot></slot>
      </div>

      <div>
        <p class="font-bold text-lg">
          {{ title }}
        </p>

        <p class="text-sm text-gray-400">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <UButton
      :color="disabled ? 'gray' : 'primary'"
      :variant="disabled ? 'soft' : 'solid'"
      :disabled="disabled"
      block
      class="max-md:hidden w-24 max-lg:ml-16"
    >
      {{ disabled ? $t('soon') : $t('details') }}
    </UButton>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string; disabled?: boolean }>();
</script>
