<template>
    <div class="tools">
        <button
            v-if="!hideDeleteButton"
            class="tools__restart-button"
            @click="openModal"
        >
            <Icon name="heroicons-outline:trash" size="18" />
        </button>
        <LanguageSwitcher />
    </div>
</template>

<script setup lang="ts">
import { useRegistrationStore } from '@surf/nuxt-base/stores/registration';
import { usePersonaStore } from '@surf/nuxt-base/stores/persona';
import { useIssuedCredentialStore } from '@surf/nuxt-base/stores/issued-credential';
import { useSessionStore } from '@surf/nuxt-base/stores/session';
import { useResultStore } from '@surf/nuxt-base/stores/result';
import { useApplicationStore } from '@surf/nuxt-base/stores/application';
import Confirm from './Confirm.vue'

defineProps<{
    hideDeleteButton?: boolean;
}>();

const personaStore = usePersonaStore();
const registrationStore = useRegistrationStore();
const issuedCredentialStore = useIssuedCredentialStore();
const sessionStore = useSessionStore();
const resultStore = useResultStore();
const applicationStore = useApplicationStore();
const localePath = useLocalePath();

const modal = useModal();
const toast = useToast();
const { t } = useI18n();

function openModal() {
  modal.open(Confirm, {
    title: 'confirm_reset_demo.title',
    description: 'confirm_reset_demo.description',
    onConfirm() {
      personaStore.$reset();
      registrationStore.$reset();
      issuedCredentialStore.$reset();
      resultStore.$reset();
      sessionStore.$reset();
      applicationStore.$reset();
      toast.add({
        title: t('confirm_reset_demo.success'),
        id: 'confirm-reset-success',
        icon: 'i-heroicons-check-circle-16-solid',
        color: 'green',
      });
      navigateTo(localePath('/'));
    }
  })
}
</script>

<style lang="css" scoped>
.tools {
    @apply
        w-full
        flex
        justify-between
        pt-2
        pb-1
        px-3
        bg-primary
        text-white
    ;
}
</style>