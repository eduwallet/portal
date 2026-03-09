import { defineStore } from 'pinia';
import type { Impairment } from '@surf/nuxt-base/server/api/impairments/types';

export const useImpairmentStore = defineStore('impairment', {
    state: () => ({
        impairments: [] as Impairment[],
    }),
    actions: {
        async fetchImpairments() {
            try {
                this.impairments = await $fetch('/api/impairments');
            } catch {
                this.impairments = [];
            }
        },
    },
});
