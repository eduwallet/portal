<template>
    <template v-if="state === 'CLEAR'">
        <div class="w-full flex flex-col items-center">
            <img
                v-if="image"
                :src="image"
                class="h-16 mb-4"
            />
            <UButton
                block
                color="blue"
                size="lg"
                icon="i-mdi-wallet-bifold-outline"
                class="whitespace-nowrap"
                :disabled="disabled"
                @click="init"
            >
                {{ $t('add_to_wallet') }}
            </UButton>
        </div>
    </template>

    <template v-if="state === 'LOADINGQR'">
        <LoadingIndicator />
    </template>

    <template v-if="state === 'SHOWQR'">
      <div class="w-full flex flex-col gap-2 items-center">
        <p class="text-sm font-bold text-center">
          {{ $t('scan_qr_code') }}
        </p>
        <UButton
            color="white"
            class="text-gray-400 underline text-sm"
            variant="link"
            @click="reset()"
        >
            {{ $t('cancel') }}
        </UButton>
        <UButton
            v-if="qrUri"
            icon="i-heroicons-magnifying-glass-plus"
            variant="ghost"
            size="xs"
            class="hidden lg:inline-flex"
            @click="isModalOpen = true"
        />
        <UModal v-model="isModalOpen" @close="isModalOpen = false">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-end">
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            class="-my-1"
                            @click="isModalOpen = false"
                        />
                    </div>
                </template>
                <QrcodeSvg
                    :value="qrUri"
                    :size="500"
                    :image-settings="imageSettings"
                    class="scale-90 -m-4"
                />
            </UCard>
        </UModal>
        <NuxtLink v-if="qrUri" :to="qrUri" class="w-full flex justify-center">
          <QrcodeSvg
            :value="qrUri"
            :size="280"
            :image-settings="imageSettings"
            class="max-w-full object-contain object-top"
          />
        </NuxtLink>
        <USkeleton v-else class="bg-gray-50 h-[280px] w-[280px]" />
      </div>
    </template>

    <template v-if="state === 'WAITING'">
      <div class="w-full flex flex-col gap-2 items-center">
        <p class="text-sm font-bold text-center">
          {{ $t('follow_wallet_instructions') }}
        </p>
        <UButton
            color="white"
            class="text-gray-400 underline text-sm"
            variant="link"
            @click="reset()"
        >
            {{ $t('cancel') }}
        </UButton>
        <img src="/images/qr-status-see-app.png" alt="" height="200" />
      </div>
    </template>

    <template v-if="state === 'FINISHED'">
      <div class="w-full flex flex-col gap-2 items-center">
        <UButton
            block
            color="white"
            size="lg"
            icon="i-heroicons-check-circle-solid"
            class="whitespace-nowrap text-blue-700"
            disabled
        >
            {{ $t('added_to_wallet') }}
        </UButton>
        <UButton
            color="white"
            class="text-gray-400 underline text-sm"
            variant="link"
            @click="addAgain()"
        >
            {{ $t('add_to_wallet_again') }}
        </UButton>
      </div>

    </template>
</template>

<script setup lang="ts">
import QrcodeSvg, { type ImageSettings } from 'qrcode.vue';
import { useSessionStore } from '@surf/nuxt-base/stores/session';

const props = defineProps<{
    credentialType: string;
    payload?: object;
    image?: string;
    disabled?: boolean;
}>();

const emit = defineEmits(['change']);

type State = 'CLEAR' | 'LOADINGQR' | 'SHOWQR' | 'WAITING' | 'FINISHED';

// const state = ref<State>('FINISHED');
const state = ref<State>('CLEAR');
const qrUri = ref<string>('');
const checkId = ref<string>('');
const intervalId = ref();
const isModalOpen = ref(false);

const sessionStore = useSessionStore();
const toast = useToast();
const { t } = useI18n();

const imageSettings = ref<ImageSettings>({
    src: '/images/icons/wallet.svg',
    width: 20,
    height: 20,
    excavate: true,
});

const reset = () => {
    state.value = 'CLEAR';
    qrUri.value = '';
    checkId.value = '';
    stopChecking();
    emit('change', null);
};

const init = async () => {
    state.value = 'LOADINGQR';

    try {
        const response = await fetch('/api/credential-offer', {
            method: 'POST',
            body: JSON.stringify({
                credentialType: props.credentialType,
                ...(props.payload || {}),
            }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStore.token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch QR code');
        
        const data = await response.json();
        qrUri.value = data.qr_uri;
        checkId.value = data.qr_id;
        state.value = 'SHOWQR';
    } catch {
        reset();
        toast.clear();
        toast.add({
            title: t('_notifications.error.qr'),
            icon: 'i-heroicons-x-circle-16-solid',
            color: 'red',
        });
    }
};

const addAgain = async () => {
    reset();
    init();
};

const startChecking = () => {
    stopChecking();
    intervalId.value = setInterval(async () => {
        try {
            const response = await fetch(`/api/credential-offer-acf/${checkId.value}`);
            const data = await response.json();
            if (data.status === 'CREDENTIAL_ISSUED') {
                state.value = 'FINISHED';
                emit('change', data.credential);
                stopChecking();
            } else if ([
                'OFFER_URI_RETRIEVED',
                'AUTHORIZATION_REQUEST_RETRIEVED',
                'CREDENTIAL_REQUEST_RECEIVED',
            ].includes(data.status)) {
                state.value = 'WAITING';
            }
        } catch (error) {
            console.error(error);
            reset();
        }
    }, 3000);
};

const stopChecking = () => {
    clearInterval(intervalId.value);
};

watchEffect(() => {
    if ((state.value === 'SHOWQR' || state.value === 'WAITING') && qrUri.value && checkId.value) {
        startChecking();
    } else {
        stopChecking();
    }
});
</script>