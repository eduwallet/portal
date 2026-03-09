import { defineStore } from 'pinia';
import type { Support } from '@surf/nuxt-base/server/api/support/types';

export const useSupportStore = defineStore('support', {
    state: () => ({
        support: [] as Support[],
    }),
    actions: {
        async fetchSupport() {
            try {
                this.support = await $fetch('/api/support');
            } catch {
                this.support = [];
            }
        },
    },
});
