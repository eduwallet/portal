<template>
  <div class="account">
    <div v-if="isLoggedIn" class="account__details">
      <p class="account__username">{{ persona?.displayName }}</p>
      <button class="account__logout" @click="logOut">
        {{ $t('log_out') }}
      </button>
    </div>

    <UAvatar
      v-if="isLoggedIn && avatarSrc"
      class="account__avatar"
      :src="avatarSrc"
      alt="Avatar"
      size="lg"
      imgClass="object-cover"
    />

    <UButton
      v-if="!isLoggedIn"
      :to="localePath('/login')"
      class="account__login"
      size="md"
      color="white"
      variant="outline"
    >
      {{ $t('log_in') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { usePersonaStore } from '@surf/nuxt-base/stores/persona';
import { useSessionStore } from '@surf/nuxt-base/stores/session';
import { useEnvironmentStore } from '@surf/nuxt-base/stores/environment';
import { useMeStore } from '@surf/nuxt-base/stores/me';
import * as jose from 'jose';
import { computed, ref, watch, onMounted } from 'vue';

const personaStore = usePersonaStore();
const sessionStore = useSessionStore();
const meStore = useMeStore();
const environmentStore = useEnvironmentStore();

const localePath = useLocalePath();
const { appName, appType } = useAppConfig();

onMounted(async () => {
  if (!environmentStore.variables.length) {
    await environmentStore.fetchVariables();
  }

  if (!personaStore.personas.length) {
    await personaStore.fetchPersonas();
  }

  if (isLoggedIn.value && !meStore.hasFetchedMe) {
    await meStore.fetchMe();
  }
});

const imageBaseUrl = computed(() => {
  return environmentStore.variables.find(v => v.key === 'imageBaseUrl')?.value || '';
});

const isTokenValid = (token?: string) => {
  if (!token) return false;
  try {
    const decoded = jose.decodeJwt(token);
    return Date.now() < (decoded?.exp || 0) * 1000;
  } catch {
    return false;
  }
};

const isLoggedIn = ref(
  (appName === 'registration' && personaStore.selectedPersona !== null) ||
  (appType === 'my' && isTokenValid(sessionStore.token))
);

watch(
  () => sessionStore.token,
  async (token) => {
    if (!isTokenValid(token)) {
      isLoggedIn.value = false;
      meStore.resetMe();
      return;
    }

    isLoggedIn.value = true;

    if (!meStore.hasFetchedMe) {
      await meStore.fetchMe();
    }
  }
);

const persona = computed(() => {
  if (appName === 'registration') return personaStore.selectedPersona;
  if (appType === 'my') return meStore.me;
  return null;
});

const avatarSrc = computed(() => {
  const id = persona.value?._ID;
  if (!imageBaseUrl.value) return undefined;
  return id ? `${imageBaseUrl.value}/photos/${id}.jpg` : undefined;
});

const logOut = () => {
  if (appName === 'registration') {
    personaStore.selectedPersona = null;
  }

  if (appType === 'my') {
    sessionStore.tokens = sessionStore.tokens.filter(
      (t) => t.appName !== appName
    );
  }

  meStore.resetMe();
  isLoggedIn.value = false;

  navigateTo(localePath('/'));
};
</script>

<style lang="css" scoped>
.account {
    @apply
        flex
        items-center
    ;
}

.account__username {
    @apply
        font-semibold
        text-sm
    ;
}

.account__logout {
    @apply
        text-xs
        hover:underline
    ;
}

.account__details {
    @apply
        flex
        flex-col
        items-end
    ;
}

.account__avatar {
    @apply
        ms-2
    ;
}

.account__login {
    @apply
        text-base
    ;
}
</style>