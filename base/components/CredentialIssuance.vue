<template>
  <WalletBase
    :qr_uri="data?.qr_uri || ''"
    :status="status"
    :toReceive="$t(`_credential.${credentialType}`)"
    :toReceiveNext="credentialTypeNext ? $t(`_credential.${credentialTypeNext}`) : ''"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import type { GetCredentialOfferResponse } from '@surf/nuxt-base/server/api/credential-offer/types';
import type { CreateOfferResponse } from '@surf/nuxt-base/server/utils/credential-offer';
import { useIssuedCredentialStore } from '@surf/nuxt-base/stores/issued-credential';
import { useSessionStore } from '@surf/nuxt-base/stores/session';
import { navigateTo, useAsyncData, useRoute } from 'nuxt/app';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  credentialType: string;
  credentialTypeNext: string;
  credential: string;
}>();

const emits = defineEmits(['cancel', 'success']);

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const issuedCredentialStore = useIssuedCredentialStore();
const sessionStore = useSessionStore();
const parsedCredential = JSON.parse(atob(props.credential));

const { data, error } = await useAsyncData<CreateOfferResponse>(
  async () =>
    $fetch('/api/credential-offer', {
      method: 'POST',
      body: parsedCredential,
      headers: {
        authorization: `Bearer ${sessionStore.token}`,
      }
    }),
  { dedupe: 'defer' },
);

if (error.value) {
  toast.clear();
  toast.add({
    title: t('_notifications.error.credential_offer'),
    icon: 'i-heroicons-x-circle-16-solid',
    color: 'red',
  });
  navigateTo(String(route.query.returnUrl));
}

const { data: statusData, refresh } = await useAsyncData<GetCredentialOfferResponse | null>(
  async () => {
    if (error.value) return null;
    return $fetch(
      `/api/credential-offer/${data.value?.qr_id}?agentPrefix=${parsedCredential.agentPrefix}`,
      {
        method: 'get',
        headers: {
          authorization: `Bearer ${sessionStore.token}`,
        },
      }
  )},
  { dedupe: 'defer' },
);

watch(
  statusData,
  () => {
    if (statusData.value?.status === 'CREDENTIAL_ISSUED') {
      issuedCredentialStore.addIssuedCredential({
        type: parsedCredential.credentialType,
        issuedAt: new Date(),
        credential: parsedCredential,
      })
      emits('success');
    } else if (statusData.value?.status === 'ERROR') {
      clearInterval(intervalId.value);
      toast.clear();
      toast.add({
        title: t(statusData.value?.result || '_notifications.error.credential_offer'),
        icon: 'i-heroicons-x-circle-16-solid',
        color: 'red',
      });
    }
  },
  { immediate: true },
);

const status = computed(() => {
  switch (statusData.value?.status) {
    case 'OFFER_CREATED':
      return 'SHOW_QR';
    case 'OFFER_URI_RETRIEVED':
    case 'ACCESS_TOKEN_CREATED':
      return 'WAITING';
    case 'CREDENTIAL_ISSUED':
      return 'SUCCESS';
    default:
      return undefined;
  }
});

const intervalId = ref();

onMounted(() => {
  if (intervalId.value || statusData.value?.status === 'CREDENTIAL_ISSUED')
    return;

  intervalId.value = setInterval(() => {
    statusData.value?.status === 'CREDENTIAL_ISSUED'
      ? clearInterval(intervalId.value)
      : refresh();
  }, 1000);
});

onBeforeUnmount(() => clearInterval(intervalId.value));
</script>
