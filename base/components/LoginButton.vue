<template>
  <NuxtLink
    class="p-5 md:pr-8 rounded-[10px] border border-primary-900 bg-white flex gap-5 items-center"
    :class="{ 'hover:bg-opacity-30 transition-colors': to }"
    :to="to"
  >
    <div class="h-auto w-12">
      <slot></slot>
    </div>

    <p class="text-primary-900 text-lg">
      {{ label }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ label: string; to: string }>();
</script>
