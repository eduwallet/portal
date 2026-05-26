<template>
    <div class="flex flex-col gap-1 my-2">
        <p class="text-sm font-bold">
            {{ $t('no_wallet_yet') }}
        </p>
        <NuxtLink
            @click="isWalletsModalOpen=true" 
            class="underline text-blue-500 text-sm cursor-pointer"
        >
        {{ $t('explore_options') }}
        </NuxtLink>
        <UModal
            v-model:open="isWalletsModalOpen"
            :ui="{ content: 'sm:max-w-6xl' }"
        >
            <template #content>
                <Wallets @cancel="isWalletsModalOpen=false"/>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isWalletsModalOpen = ref(false);
</script>
