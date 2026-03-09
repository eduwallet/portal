import { defineStore } from 'pinia';
import type { Institution } from '@surf/nuxt-base/server/api/institutions/types';

export const useInstitutionStore = defineStore('institution', {
    state: () => ({
        institutions: [] as Institution[],
    }),
    getters: {
        getInstitutionById: (state) => (id: string): Institution | undefined =>
            state.institutions.find((i: Institution) => i.id === id),
        institutionIdFromAppName: (state) => (appName: string): string =>
            state.institutions.find((i: Institution) => appName.includes(i.shortcode))?.id || ''
    },
    actions: {
        async fetchInstitutions() {
            try {
                this.institutions = await $fetch('/api/institutions');
            } catch {
                this.institutions = [];
            }
        },
    },
});
