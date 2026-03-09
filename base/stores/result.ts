import { defineStore } from 'pinia';

export const useResultStore = defineStore('result', {
    state: () => ({
        results: [] as string[],
    }),
    persist: true,
});
