<template>
  <UModal>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
            <div class="flex items-center justify-between">
                <h3>{{ $t(title) }}</h3>
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="modal.close"
                />
            </div>
        </template>

        <p>{{ $t(description) }}</p>

        <template #footer>
            <div class="flex items-center gap-6 py-2">
                <UButton
                    class="flex-grow justify-center"
                    variant="outline"
                    color="red"
                    @click="modal.close"
                >
                    {{ $t('cancel') }}
                </UButton>
                <UButton class="flex-grow justify-center" @click="onConfirm">
                    {{ $t('confirm') }}
                </UButton>
            </div>
        </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

const emit = defineEmits(['confirm']);

const modal = useModal();

const onConfirm = () => {
    emit('confirm');
    modal.close();
};
</script>
