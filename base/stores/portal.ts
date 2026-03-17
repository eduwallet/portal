import { defineStore } from 'pinia';

export const usePortalStore = defineStore('portal', {
    state: () => ({
        pilotLink: '',
        institution: '',
    }),
    persist: {
        pick: ['pilotLink', 'institution'],
    },
});
