<template>
  <template v-for="o in options" :key="o.title">
    <UCheckbox :id="o.title" :disabled>
      <template #label>
        {{ o.title }} <span class="text-gray-400">({{ o.count }})</span>
      </template>
    </UCheckbox>
  </template>
</template>

<script setup lang="ts">
type Option = { title: string; count: number };

defineProps<{
  options: Option[],
  disabled?: boolean,
}>();
</script>
