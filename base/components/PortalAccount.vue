<template>
    <div class="account">
        <div
            v-if="isLoggedIn"
            class="account__details"
        >
            <p class="account__username">
                {{ fullName }}
            </p>
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

const { loggedIn, user, logout, clear } = useOidcAuth();

const portalStore = usePortalStore();

const isLoggedIn = computed(() => portalStore.firstName !== '');
const fullName = computed(() => portalStore.fullName);

const logOut = () => {
    portalStore.$reset();
    logout();
    clear();
}
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
</style>