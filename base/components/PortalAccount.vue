<template>
    <div class="account">
        <div
            v-if="isLoggedIn"
            class="account__details"
        >
            <button
                v-if="loggedIn"
                class="account__logout"
                @click="logOut"
            >
                {{ $t('log_out') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePortalStore } from '@surf/nuxt-base/stores/portal';
import { computed } from 'vue';

const { loggedIn, logout, clear } = useOidcAuth();

const portalStore = usePortalStore();

const isLoggedIn = computed(() => portalStore.pilotLink !== '');

const logOut = () => {
    portalStore.$reset();
    logout();
    clear();
}
</script>

<style lang="css" scoped>
@reference "tailwindcss";
@reference "@nuxt/ui";
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
</style>