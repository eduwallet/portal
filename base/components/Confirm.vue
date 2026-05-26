<template>
  <UModal :title="$t(title)" :close="false">
    <template #body>
      <p>{{ $t(description) }}</p>
    </template>
    <template #footer>
      <div class="flex items-center gap-6 py-2">
        <UButton
          class="flex-grow justify-center"
          variant="outline"
          color="error"
          @click="overlay.close"
        >
          {{ $t('cancel') }}
        </UButton>
        <UButton class="flex-grow justify-center" @click="onConfirm">
          {{ $t('confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

const emit = defineEmits(['confirm']);

const overlay = useOverlay();

const onConfirm = () => {
    emit('confirm');
    overlay.close();
};
</script>
