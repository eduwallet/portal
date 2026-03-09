import { defineStore } from 'pinia';

export const usePortalStore = defineStore('portal', {
    state: () => ({
        firstName: '',
        fullName: '',
        pilotLink: '',
        institution: '',
    }),
    persist: {
        pick: ['firstName', 'fullName', 'pilotLink', 'institution'],
    },
});
