<template>
    <div v-if="state === 'CLEAR'" class="w-full">
        <UButton
            color="primary"
            @click="init"
        >
            <SvgoWallet class="wallet-icon" />
            {{ $t('share_from_wallet') }}
        </UButton>
    </div>
    <div
        v-else
        class="w-full"
    >
        <div
            v-if="state === 'SHOWQR'"
            class="flex items-center gap-3 rounded-md p-4 bg-white"
        >
            <NuxtLink
                v-if="qrUri"
                :to="qrUri"
            >
                <QrcodeSvg
                    :value="qrUri"
                    :size="120"
                    :image-settings="imageSettings"
                />
            </NuxtLink>
            <USkeleton
                v-else
                class="h-[120px] w-[120px] animation-pulse"
            />
            <p class="font-bold">
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
                {{ $t(qrUri ? 'scan_qr_code' : 'waiting_for_qr_code') }}
            </p>
            <UButton
                color="black"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="self-start ms-auto -mt-2 -me-2"
                @click="reset()"
            />
        </div>
        <div
            v-else-if="state === 'WAITING'"
            class="flex items-center gap-3 rounded-md p-4 bg-white"
        >
            <img
                src="/images/qr-status-see-app.png"
                alt=""
                class="w-[120px] object-cover"
            />
            <p class="font-bold">
                {{ $t('follow_wallet_instructions') }}
            </p>
            <UButton
                color="black"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="self-start ms-auto -mt-2 -me-2"
                @click="reset()"
            />
        </div>
        <div
            v-else-if="state === 'FINISHED'"
            class="flex items-center gap-3 rounded-md p-4 bg-white"
        >
            <img
                v-if="issuerImage"
                :src="issuerImage"
                alt=""
                class="h-[120px] w-[120px] object-cover"
            />
            <USkeleton
                v-else
                class="h-[120px] w-[120px] animation-pulse"
            />
            <p class="flex flex-col">
                <span>{{ issuerName }}</span>
                <span class="text-xl font-bold">{{ mainClaim }}</span>
                <span class="font-bold">{{ validity }}</span>
            </p>
            <UButton
                color="black"
                variant="ghost"
                icon="i-heroicons-trash-solid"
                class="self-start ms-auto -mt-2 -me-2"
                @click="reset()"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import SvgoWallet from '~/assets/icons/wallet.svg'
import QrcodeSvg, { type ImageSettings } from 'qrcode.vue';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
    path: string;
    name: string;
    mainClaim: string;
    validFromClaim?: string;
    validUntilClaim?: string;
}>();

const emit = defineEmits(['change']);

type State = 'CLEAR' | 'SHOWQR' | 'WAITING' | 'FINISHED';

const state = ref<State>('CLEAR');
const qrUri = ref('');
const checkId = ref('');
const intervalId = ref();
const credential = ref<any>(null);
const issuer = ref('');
const issuerName = ref('');
const issuerImage = ref('');
const isModalOpen = ref(false);

const { t, locale } = useI18n();
const toast = useToast();

const imageSettings = ref<ImageSettings>({
    src: '/images/icons/wallet.svg',
    width: 20,
    height: 20,
    excavate: true,
});

const deepLookup = (obj: any, path: string): any => {
    if (!obj || typeof obj !== 'object') return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
};

const mainClaim = computed(() => {
    if (!credential.value) return '';
    return deepLookup(credential.value, props.mainClaim) || '';
});

const validity = computed(() => {
    if (!credential.value) return '';
    if (!props.validFromClaim && !props.validUntilClaim) return t('valid_forever');
    
    return [
        props.validFromClaim ? t('valid_from', {
            from: deepLookup(credential.value, props.validFromClaim || ''),
            // from: new Date(deepLookup(credential.value, props.validFromClaim || '')).toLocaleDateString(locale.value, {
            //     year: 'numeric',
            //     month: 'long',
            //     day: 'numeric',
            // }),
        }) : '',
        props.validUntilClaim ? t('valid_until', {
            until: deepLookup(credential.value, props.validUntilClaim || ''),
            // until: new Date(deepLookup(credential.value, props.validUntilClaim || '')).toLocaleDateString(locale.value, {
            //     year: 'numeric',
            //     month: 'long',
            //     day: 'numeric',
            // }),
        }) : '',
    ].filter(Boolean).join(' ').trim() || t('valid_forever');
});

const reset = () => {
    state.value = 'CLEAR';
    qrUri.value = '';
    checkId.value = '';
    credential.value = null;
    issuer.value = '';
    issuerName.value = '';
    issuerImage.value = '';
    emit('change', null);
};

const init = async () => {
    state.value = 'SHOWQR';

    try {
        const response = await fetch('/api/verifiable-presentation', {
            method: 'POST',
            body: JSON.stringify({
                path: props.path,
            }),
        });

        if (!response.ok) throw new Error('Failed to fetch QR code');
        
        const data = await response.json();
        qrUri.value = data.requestUri;
        checkId.value = data.id;
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

const startChecking = () => {
    stopChecking();
    intervalId.value = setInterval(async () => {
        try {
            const response = await fetch(`/api/verifiable-presentation/${checkId.value}`);
            const data = await response.json();
            if (data.status === 'RESPONSE_RECEIVED') {
                state.value = 'FINISHED';
                credential.value = data.result.credentials[props.name]?.[0];
                emit('change', credential.value);
                stopChecking();
                if (!credential.value) {
                    toast.add({
                        title: t('_notifications.error.verifiable_presentation'),
                        icon: 'i-heroicons-x-circle-16-solid',
                        color: 'red',
                    });
                    throw new Error(t('_notifications.error.verifiable_presentation'));
                }
                issuer.value = credential.value.issuer;
            } else if (data.status === 'AUTHORIZATION_REQUEST_RETRIEVED') {
                state.value = 'WAITING';
            }
        } catch (error) {
            console.error(error);
            reset();
        }
    }, 5000);
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

watchEffect(async () => {
    if (!issuer.value) return;
    
    const issDomain = issuer.value.split(':').pop();
    const domainParts = String(issDomain).split('.');
    const domain = domainParts.slice(-3).join('.');
    const subDomain = domainParts.slice(0, -3).join('');
    const response = await fetch(`https://agent.${domain}/${subDomain}/.well-known/openid-credential-issuer`);

    if (!response.ok) return;

    const issuerData = await response.json();
    issuerName.value = issuerData.display.find((d: { locale: string }) => d.locale === locale.value)?.name ||
        issuerData.display?.[0].name ||
        ''
    ;

    issuerImage.value = (deepLookup(credential.value, 'claims.achievement.image.id') || '').replace('11BR', 'mbob') ||
        issuerData.credential_configurations_supported[props.name]?.display?.[0]?.logo?.url ||
        issuerData.display.find((d: { locale: string }) => d.locale === locale.value)?.logo?.url ||
        issuerData.display?.[0].logo?.url ||
        ''
    ;
});
</script>

<style scoped>
.wallet-icon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
}
</style>
