import { defineStore } from 'pinia';

interface Application {
    credentials: (object | null)[];
    motivation: string;
    vacancyId: string;
}

export const useApplicationStore = defineStore('application', {
    state: () => ({
        applications: [] as Application[],
    }),
    persist: {
        pick: ['applications'],
    },
});
