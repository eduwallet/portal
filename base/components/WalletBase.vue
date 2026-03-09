<template>
  <div class="flex flex-col gap-4 items-center text-center max-w-xs w-full">

    <div class="p-4 border rounded-md w-full flex flex-col gap-5 text-start">
      <p class="text-xl font-bold">
        {{ $t('you_receive') }}
      </p>
      <div class="py-2 px-3 border rounded-md w-full bg-green-200">
        <p class="font-bold">
          {{ toReceive }}
        </p>
      </div>
      <p v-if="toReceiveNext && props.status === 'SHOW_QR'" class="text-xl font-bold">
        {{ $t('you_receive_next') }}
      </p>
      <div v-if="toReceiveNext && props.status === 'SHOW_QR'" class="py-2 px-3 border rounded-md w-full bg-green-200">
        <p class="font-bold">
          {{ toReceiveNext }}
        </p>
      </div>
    </div>

    <template v-if="props.status === 'SHOW_QR'">
      <div class="p-4 border rounded-md w-full flex flex-col gap-5 items-center">
        <p class="text-xl font-bold">
          {{ $t('scan_qr_code') }}
        </p>
        <NuxtLink v-if="qr_uri" :to="qr_uri">
          <QrcodeSvg :value="qr_uri" :size="280" />
        </NuxtLink>
        <USkeleton v-else class="bg-gray-50 h-[280px] w-[280px]" />
        <span class="text-sm">
          <strong class="me-1">{{ $t('no_wallet_yet') }}</strong>
          <NuxtLink @click="isWalletsModalOpen=true" class="underline cursor-pointer text-blue-500">
            {{ $t('download.here') }}
          </NuxtLink>.
          <UModal v-model="isWalletsModalOpen" :ui="{ width: 'w-full sm:max-w-6xl' }">
            <Wallets @cancel="isWalletsModalOpen=false"/>
          </UModal>
        </span>
      </div>
    </template>

    <template v-else-if="props.status === 'WAITING'">
      <div class="p-4 border rounded-md w-full flex flex-col gap-5 items-center">
        <p class="text-xl font-bold">
          {{ $t('follow_wallet_instructions') }}
        </p>
        <img src="/images/qr-status-see-app.png" alt="" height="200" />
      </div>
    </template>

    <UButton
      v-if="props.status === 'WAITING' || props.status === 'SHOW_QR'"
      color="white"
      class="text-gray-400 underline"
      variant="link"
      @click="$emit('cancel')"
    >
      {{ $t('cancel') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import QrcodeSvg from 'qrcode.vue';
import { ref } from 'vue';

const props = defineProps<{
  qr_uri: string;
  status?: 'SHOW_QR' | 'WAITING';
  toReceive: string;
  toReceiveNext: string;
}>();

const isWalletsModalOpen = ref(false);
</script>
